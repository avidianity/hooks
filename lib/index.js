import { useState, useRef, useCallback, useEffect } from 'react';

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
		array.push(element);
		setArray([...array]);
	}

	function filter(callback) {
		setArray((a) => a.filter(callback));
	}

	function update(index, newElement) {
		array.splice(index, 1, newElement);
		setArray([...array]);
	}

	function remove(index) {
		array.splice(index, 1);
		setArray([...array]);
	}

	function clear() {
		setArray([]);
	}

	return { array, set: setArray, push, filter, update, remove, clear };
}

export function useWindowWidth() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleWindowResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	return windowWidth;
}

export function useResponsiveValue() {
	const width = useWindowWidth();

	const calculate = useCallback(() => {
		if (width >= 1536 && !!data.xxl) {
			return data.xxl;
		} else if (width >= 1280 && !!data.xl) {
			return data.xl;
		} else if (width >= 1024 && !!data.lg) {
			return data.lg;
		} else if (width >= 768 && !!data.md) {
			return data.md;
		} else if (width >= 640 && !!data.sm) {
			return data.sm;
		}

		return data.value;
	}, [data.xxl, data.xl, data.lg, data.md, data.sm, data.value, width]);

	const [value, setValue] = useState(calculate);

	useEffect(() => {
		setValue(calculate());
	}, [calculate, width]);

	return value;
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
		if (jsonValue) {
			return JSON.parse(jsonValue);
		}

		return defaultValue;
	});

	useEffect(() => {
		if (value === undefined || value === null) {
			return storageObject.removeItem(key);
		}
		storageObject.setItem(key, JSON.stringify(value));
	}, [key, value, storageObject]);

	const remove = useCallback(() => {
		setValue(undefined);
	}, []);

	return { value, setValue, remove };
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
