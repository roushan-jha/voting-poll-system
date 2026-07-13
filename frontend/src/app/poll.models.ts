export interface Poll {
    id: number;
    question: string;
    options: OptionVote[];
}

export interface OptionVote {
    optionText: string;
    votes: number;
}
