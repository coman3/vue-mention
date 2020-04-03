import User from './User';
import Task from './Task';
import Job from './Job';

export type MentionResultFetcher = (filter: string) => Promise<MentionResults>;

/**
 * What a mention item must have to be implemented
 */
export interface Mention {
    name: string;
    id: string;
}

/**
 * Type of the mention
 */
export enum MentionType {
    Task,
    User,
    Job,
}

/**
 * A model that groups items by type with a title
 */
export class MentionResult<TType extends Mention> {
    title: string;
    type: MentionType;
    items: TType[];

    constructor(title: string, type: MentionType, items: TType[]) {
        this.title = title;
        this.type = type;
        this.items = items;
    }

}

/**
 * All results from a filter response
 */
export class MentionResults {
    results: MentionResult<Mention>[];
    constructor(results: MentionResult<Mention>[]) {
        this.results = results;
    }
}

/**
 * A provider for results from a filter search
 * It is recommended that you debounce your network requests
 */
export default class MentionResultProvider {

    fetchResults: MentionResultFetcher = this.fetchAsync;

    constructor(fetcher?: MentionResultFetcher) {
        if (fetcher != undefined) {
            this.fetchResults = fetcher;
        }

    }

    protected autoComplete(value: string): MentionResult<any> | null {
        return new MentionResult<User>("Users", MentionType.User, [
            {
                name: "Lachlan Velden",
                id: "176b8fb2-c70c-40a0-8c4b-aa89c020086e"
            }
        ]);
    }

    protected async fetchAsync(filter: string): Promise<MentionResults> {
        return new Promise<MentionResults>((res) => res(new MentionResults(
            [
                new MentionResult<User>("Users", MentionType.User, [
                    {
                        name: "Lachlan Velden",
                        id: "176b8fb2-c70c-40a0-8c4b-aa89c020086e"
                    },
                    {
                        name: "Bob Jones",
                        id: "f6b6f9ce-9d48-43ac-b0b7-b2f8098a51f6"
                    },
                    {
                        name: "Franklin whald",
                        id: "edd0b3c0-4c69-4037-8e85-66e2a6b73b6e"
                    }
                ].filter(x => x.name.toLowerCase().includes(filter.toLowerCase()))),
                new MentionResult<Task>("Tasks", MentionType.Task, [
                    {
                        name: "DDOS the mainframe",
                        id: "693b7364-3257-4eae-b4df-a7a13268c86e"
                    },
                    {
                        name: "Kill some zombies",
                        id: "603e3d55-a004-4944-8ddc-ff95391f3b69"
                    },
                    {
                        name: "Buy toilet paper",
                        id: "d1dd6aa3-d306-498a-882c-caf12ee27280"
                    }
                ].filter(x => x.name.toLowerCase().includes(filter.toLowerCase()))),
                new MentionResult<Job>("Jobs", MentionType.Job, [
                    {
                        name: "Bank Security Checkup",
                        id: "dff1e2a6-0fee-4f01-b85e-1eb7a81be47b"
                    },
                    {
                        name: "Corona Recovery",
                        id: "41fceb36-31a2-4990-ab8d-96d91dcbe3c9"
                    }
                ].filter(x => x.name.toLowerCase().includes(filter.toLowerCase())))
            ].filter(x => x.items.length > 0)
        )));
    }

}
