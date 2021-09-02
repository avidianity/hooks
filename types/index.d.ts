import React from 'react';

export function useURL(): (path: string) => string;

export function useMode(): ['Add' | 'Edit', React.Dispatch<React.SetStateAction<'Add' | 'Edit'>>];

export function useNullable<T>(data?: T): [T | null, React.Dispatch<React.SetStateAction<T | null>>];

export function useArray<T>(data?: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>];
