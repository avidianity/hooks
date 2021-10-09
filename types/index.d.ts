import React from 'react';

export function useURL(): (path: string) => string;

export function useMode(): ['Add' | 'Edit', React.Dispatch<React.SetStateAction<'Add' | 'Edit'>>];

export function useNullable<T>(data?: T): [T | null, React.Dispatch<React.SetStateAction<T | null>>];

export function useArray<T>(data?: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>];

export type UseArrayComplexReturn<T> = {
	array: T[];
	set: React.Dispatch<React.SetStateAction<T[]>>;
	push: (element: T) => void;
	filter: (predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: T[]) => void;
	update: (index: number, element: T) => void;
	remove: (index: number) => void;
	clear: () => void;
};

export function useArrayComplex<T>(data?: T[]): UseArrayComplexReturn<T>;

export function usePartial<T extends object>(data?: Partial<T>): [Partial<T>, React.Dispatch<React.SetStateAction<Partial<T>>>];

export function useToggle(defaultValue: boolean): [boolean, (value?: boolean | ((value: boolean) => boolean)) => void];

export type UseTimeoutReturn = { set: Function; clear: Function };

export function useTimeout(callback: () => void, delay: number): UseTimeoutReturn;

export function useDebounce(callback: () => void, delay: number, dependencies?: React.DependencyList): void;

export function useUpdateEffect(callback: () => void, dependencies?: React.DependencyList): void;

export function usePrevious<T>(value: T): T;

export type UseStorageReturn<T> = {
	value: T;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	remove: () => void;
};

export function useLocalStorage<T>(key: string, defaultValue: T): UseStorageReturn<T>;

export function useSessionStorage<T>(key: string, defaultValue: T): UseStorageReturn<T>;

export function useStorage<T>(key: string, defaultValue: T, storage: Storage): UseStorageReturn<T>;

export type UseAsyncReturn<T> = {
	value?: T;
	loading: boolean;
	error?: any;
};

export function useAsync<T>(callback: () => Promise<T>, dependencies?: React.DependencyList): UseAsyncReturn<T>;
