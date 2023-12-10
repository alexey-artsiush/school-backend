import OpenAI from 'openai'

export class ChatGPTController {
    async sendMessage(req, res, next) {
        try {
            const { message } = req.body

            if (!message) {
                return res.status(400).json({ error: 'Отсутствует сообщение' })
            }
            const openai = new OpenAI({ apiKey: process.env.CHAT_GPT_KEY })

            const stream = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                stream: true,
            })

            let response = ''

            for await (const chunk of stream) {
                response += chunk.choices[0]?.delta?.content || ''
            }

            return res.json({
                success: true,
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}
