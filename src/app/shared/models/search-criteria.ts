import { OperationType } from '../constants/enums';

export class SearchCriteria {
    fieldName: string;
    value: string;
    opp: OperationType;
    pageNumber: number;
    pageSize: number;
    sort: string;
}
