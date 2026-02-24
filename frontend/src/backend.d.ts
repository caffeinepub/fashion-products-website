import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    pinterestPinId: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: number;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    pinterestPinId: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(data: ProductInput): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductCount(): Promise<bigint>;
    getProductCountByCategory(category: string): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByName(nameQuery: string): Promise<Array<Product>>;
    getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: bigint, data: ProductInput): Promise<void>;
}
