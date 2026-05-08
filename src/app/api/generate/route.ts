import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const { reviewText, businessType, tone } = await req.json();

    if (!reviewText || !businessType || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check usage limits if logged in
    let usageId = null;
    let userId = null;

    if (user) {
      userId = user.id;
      // Get user plan and usage
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const { data: usageData, error: usageError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError;
      }

      if (userData.plan === 'free') {
        const currentDate = new Date();
        const resetDate = usageData ? new Date(usageData.reset_date) : new Date();

        // Reset count if new month
        if (usageData && currentDate > resetDate) {
          const newResetDate = new Date();
          newResetDate.setMonth(newResetDate.getMonth() + 1);
          newResetDate.setDate(1);
          newResetDate.setHours(0, 0, 0, 0);

          await supabase
            .from('usage')
            .update({ reply_count: 0, reset_date: newResetDate.toISOString() })
            .eq('id', usageData.id);

          usageData.reply_count = 0;
        }

        if (usageData && usageData.reply_count >= 5) {
           return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 });
        }

        usageId = usageData?.id;
      }
    }

    // Call OpenAI
    const prompt = `You are a professional business reputation manager.
Write a reply to this Google review for a ${businessType}.
Tone: ${tone}.

Rules:
- Under 150 words
- Thank reviewer by name if name is present
- Address the specific issue or compliment mentioned
- Sound warm, human, never robotic
- End with invitation to return or contact directly
- Never use generic phrases like 'We value your feedback'

Review: ${reviewText}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    });

    const generatedReply = completion.choices[0].message.content || '';

    // If logged in, increment usage and save reply
    if (user) {
       if (usageId) {
          await supabase.rpc('increment_usage', { row_id: usageId });
       }

       await supabase.from('replies').insert({
           user_id: user.id,
           review_text: reviewText,
           business_type: businessType,
           tone: tone,
           generated_reply: generatedReply
       });
    }

    return NextResponse.json({ reply: generatedReply });
  } catch (error: any) {
    console.error('Error generating reply:', error);
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}
