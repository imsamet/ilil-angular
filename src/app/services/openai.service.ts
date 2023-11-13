import { Injectable } from "@angular/core";
import { OpenAI } from 'openai';
import { ChatGPTAPI } from 'chatgpt'

@Injectable({
    providedIn: "root",
})
export class OpenaiService {

    constructor() {

    }

    async sendMessage(userMessage: string): Promise<any> {
        try {
            const openai = new ChatGPTAPI({
                apiKey: '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',
                completionParams: {
                    model: 'gpt-4',
                    temperature: 0.5,
                    top_p: 0.8,
                },
                debug: true
            });
            const chatCompletion = await openai.sendMessage('Hello World!', { onProgress: (partialResponse) => console.log(partialResponse.text) });
            return chatCompletion;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
