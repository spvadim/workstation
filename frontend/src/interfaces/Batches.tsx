export interface Batch {
    number: {
        batch_number: number,
        batch_date: string
    },
    params: {
        multipacks: number,
        packs: number,
        multipacks_after_pintset: number,
        visible?: boolean,
        id?: string
    },
    created_at?: string,
    closed_at?: string,
    id?: string
}

export interface BatchPut {
    number: {
        batch_number: number,
        batch_date: string,
    },
    params_id: string,
    id?: string,
}