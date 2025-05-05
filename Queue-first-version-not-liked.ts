import {Message} from "./Database";

type MessageId = string;
type ItemKey = string;

export class Queue {
    private messages: Message[];
    private processingIdsMap: Map<ItemKey, MessageId>;
    private processingKeys: Set<ItemKey>;

    constructor() {
        this.messages = []
        this.processingIdsMap = new Map();
        this.processingKeys = new Set();
    }

    Enqueue = (message: Message) => {
        this.messages.push(message)
    }

    Dequeue = (workerId: number): Message | undefined => {
        if (!this.Size()) {
            return undefined;
        }

        for (const [index, message] of this.messages.entries()) {
            if (
                !this.processingKeys.has(message.key)
            ) {
                this.processingKeys.add(message.key);
                this.processingIdsMap.set(message.id, message.key);

                return this.messages.splice(index, 1)[0];
            }
        }

        return undefined;
    }

    Confirm = (workerId: number, messageId: string) => {
        const key = this.processingIdsMap.get(messageId);
        this.processingIdsMap.delete(messageId);
        this.processingKeys.delete(key);
    }

    Size = () => {
        return this.messages.length;
    }
}

