import { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

export function useURL() {
	const match = useRouteMatch();

	return (path) => {
		const rootFragments = match.path.split('');
		const pathFragments = path.split('');

		if (rootFragments.last() === '/' && pathFragments.first() === '/') {
			rootFragments.pop();
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else if (rootFragments.last() !== '/' && pathFragments.first() !== '/') {
			rootFragments.push('/');
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else if (rootFragments.last() !== '/' && pathFragments.first() !== '/') {
			rootFragments.push('/');
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else {
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		}
	};
}

export function useMode(mode) {
	return useState(mode || 'Add');
}

export function useNullable(data) {
	return useState(data || null);
}

export function useArray(data) {
	return useState(data || []);
}
