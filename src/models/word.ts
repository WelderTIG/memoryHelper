export enum Weight {
    ONE = '1',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = '10',
}

export type Word = {
    id: string;
    hieroglyph: string;
    oldHieroglyph: string;
    pinyin: string;
    wordType: string;
    translation: string;
    description: string;
    weight: Weight;
    creationDate: Date;
    lastProposalDate: Date;
}