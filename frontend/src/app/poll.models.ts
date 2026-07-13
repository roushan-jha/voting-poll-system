export interface Poll {
    id: number;
    question: string;
    options: OptionVote[];
}

export interface OptionVote {
    optionText: string;
    voteCount: number;
}

export interface CreatePollRequest {
    question: string;
    options: CreateOptionRequest[];
}

export interface CreateOptionRequest {
    optionText: string;
}
