import User from './User';
import Task from './Task';

export type MentionResultFetcher = (filter: string) => Promise<MentionResults>;



export enum MentionType {
    Task,
    User,
    Job,
}

export class MentionResult<TType> {
    title: string;
    type: MentionType;
    items: TType[];

    constructor(title: string, type: MentionType, items: TType[]) {
        this.title = title;
        this.type = type;
        this.items = items;
    }

}

export class MentionResults {
    results: MentionResult<any>[];
    constructor(results: MentionResult<any>[]) {
        this.results = results;
    }
}




export default class MentionResultProvider {

    fetchResults: MentionResultFetcher = this.fetch;

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

    protected fetch(filter: string): Promise<MentionResults> {
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
                        name: "Do something",
                        id: "693b7364-3257-4eae-b4df-a7a13268c86e"
                    },
                    {
                        name: "kill some zombies",
                        id: "603e3d55-a004-4944-8ddc-ff95391f3b69"
                    },
                    {
                        name: "go shopping",
                        id: "d1dd6aa3-d306-498a-882c-caf12ee27280"
                    }
                ].filter(x => x.name.toLowerCase().includes(filter.toLowerCase())))
            ].filter(x => x.items.length > 0)
        )));
    }

}
