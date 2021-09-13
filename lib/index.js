import { useState, useRef, useCallback, useEffect } from 'react';
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

export function useArrayComplex(defaultValue = []) {
	const [array, setArray] = useState(defaultValue);

	function push(element) {
		setArray((a) => [...a, element]);
	}

	function filter(callback) {
		setArray((a) => a.filter(callback));
	}

	function update(index, newElement) {
		setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length - 1)]);
	}

	function remove(index) {
		setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length - 1)]);
	}

	function clear() {
		setArray([]);
	}

	return { array, set: setArray, push, filter, update, remove, clear };
}

export function usePartial(data) {
	return useState(data || {});
}

export function useToggle(defaultValue) {
	const [value, setValue] = useState(defaultValue);

	function toggleValue(value) {
		setValue((currentValue) => (typeof value === 'boolean' ? value : !currentValue));
	}

	return [value, toggleValue];
}

export function useTimeout(callback, delay) {
	const callbackRef = useRef(callback);
	const timeoutRef = useRef();

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const set = useCallback(() => {
		timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
	}, [delay]);

	const clear = useCallback(() => {
		timeoutRef.current && clearTimeout(timeoutRef.current);
	}, []);

	useEffect(() => {
		set();
		return clear;
	}, [delay, set, clear]);

	const reset = useCallback(() => {
		clear();
		set();
	}, [clear, set]);

	return { reset, clear };
}

export function useDebounce(callback, delay, dependencies) {
	const { reset, clear } = useTimeout(callback, delay);
	useEffect(reset, [...dependencies, reset]);
	useEffect(clear, []);
}

export function useUpdateEffect(callback, dependencies) {
	const firstRenderRef = useRef(true);

	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false;
			return;
		}
		return callback();
	}, dependencies);
}

export function usePrevious(value) {
	const currentRef = useRef(value);
	const previousRef = useRef();

	if (currentRef.current !== value) {
		previousRef.current = currentRef.current;
		currentRef.current = value;
	}

	return previousRef.current;
}

export function useLocalStorage(key, defaultValue) {
	return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage(key, defaultValue) {
	return useStorage(key, defaultValue, window.sessionStorage);
}

export function useStorage(key, defaultValue, storageObject) {
	const [value, setValue] = useState(() => {
		const jsonValue = storageObject.getItem(key);
		if (jsonValue !== null) return JSON.parse(jsonValue);

		return defaultValue;
	});

	useEffect(() => {
		if (value === undefined) return storageObject.removeItem(key);
		storageObject.setItem(key, JSON.stringify(value));
	}, [key, value, storageObject]);

	const remove = useCallback(() => {
		setValue(undefined);
	}, []);

	return [value, setValue, remove];
}

export function useAsync(callback, dependencies = []) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [value, setValue] = useState();

	const callbackMemoized = useCallback(() => {
		setLoading(true);
		setError(undefined);
		setValue(undefined);
		callback()
			.then(setValue)
			.catch(setError)
			.finally(() => setLoading(false));
	}, dependencies);

	useEffect(() => {
		callbackMemoized();
	}, [callbackMemoized]);

	return { loading, error, value };
}
