export enum Status{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum Roles{
    ADMIN = 'ADMIN',
    GUEST = 'GUEST',
}
export enum Category{
    APPLE = 'APPLE',
    SAMSUMG = 'SAMSUMG',
    XIAOMI = 'XIAOMI',
    OPPO = 'OPPO',
    VIVO = 'VIVO',
    REALME = 'REALME',
    ASUS = 'ASUS',
    NOKIA = 'NOKIA',
    SONY = 'SONY',
    LG = 'LG',
    GOOGLE = 'GOOGLE',
}


export enum ProductSortBy{
    PRICE_ASC = 'PRICE_ASC',
    PRICE_DESC = 'PRICE_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

export enum OrderStatus{
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod{
    CASH = 'CASH',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
    CARD = 'CARD',
    
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
  };

  export enum DeliveryStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
  };