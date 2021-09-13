# @avidian/hooks

React helper hooks for convenience

## Installation

npm

```sh
npm install @avidian/hooks
```

yarn

```sh
yarn add @avidian/hooks
```

## Usage

### useURL

Used to generate route path relative to the current component and route. (react-router-dom or react-router-native)

Example (using react-router-dom)

```jsx
import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useURL } from '@avidian/hooks';
import Form from './Form';
import List from './List';

export default function Component(props) => {
    const url = useURL();

    return (
        <Switch>
            <Route path={url('')} exact component={List} />
            <Route path={url('/add')} component={Form} />
            <Route path={url('/:id/edit')} component={Form} />
        </Switch>
   );
};

```

### useMode

Used for determining form mode (Add or Edit).
Defaults to 'Add'

```jsx
import React from 'react';
import { useMode } from '@avidian/hooks';

export default function Form(props) {
    const [mode, setMode] = useMode();
    const match = useRouteMatch<{ id: string }>();

    const id = match.params.id;

    const fetchData = async (id) => {
        //
    };

    useEffect(() => {
        if (match.path.includes('edit')) {
            setMode('Edit');
            fetchData(id);
        }
    }, []);

    return (
        <div>
            {mode} Data
            <form>
                <input />
                <button type='submit' >submit</button>
            </form>
        </div>
    );
}
```

### useNullable

Define state that can be null.

```jsx
import React from 'react';
import { useNullable } from '@avidian/hooks';

export default function Component() {
    const [numberOrNull, setNumberOrNull] = useNullable(15);

    return (
        <button onClick={() => {
            // errors if you're using typescript
            setNumberOrNull('1');
            setNumberOrNull({});
            setNumberOrNull();

            // works
            setNumberOrNull(0);
            setNumberOrNull(null);
        }}>
            click me
        </button>
    );
}
```

### useArray

Define an array as state.

```jsx
import React from 'react';
import { useArray } from '@avidian/hooks';

export default function Component() {
    // defaults to an array instead of undefined
    const [array, setArray] = useArray();

    // ...
}
```

### useArrayComplex

Define an array as state with it's helper methods. Using the helper methods will automatically mutate the array state for you.

```jsx
import React from 'react';
import { useComplexArray } from '@avidian/hooks';

export default function Component() {
    const { array, set, push, filter, update, remove, clear } = useComplexArray();

    // ...
}
```

### usePartial

It's the same as `useState({})` but it's useful in typescript, it makes the properties of the object optional with the `Partial<T>` generic.

```tsx
import React from 'react';

// required type
type Data = {
    title: string;
    description: string;
}

export default function Component() {
    const [value, setValue] = usePartial<Data>({
        // passing an object is optional
        title: 'My Title',
    });

    // ...
}
```

### useToggle

Define a toggleable boolean state.

```jsx
import React from 'react';
import { useToggle } from '@avidian/hooks';

export default function Component() {
    const [value, toggleValue] = useToggle(false);

    // explicitly set value
    toggleValue(true);

    // toggle the value
    toggleValue();
}
```

### useTimeout

Define a callback with a timeout

```jsx
import React from 'react';
import { useTimeout } from '@avidian/hooks';

export default function Component() {
    const { reset, clear } = useTimeout(() => {
        // do something
    }, 1000)    
}
```

### useDebounce

Define a callback with a debounce.

```jsx
import React from 'react';
import { useDebounce } from '@avidian/hooks';

export default function Component() {
    useDebounce(() => {
        // do something
    }, 5000, []);
}
```

### useUpdateEffect

Same as `useEffect` but executes after update.

```jsx
import React from 'react';
import { useUpdateEffect } from '@avidian/hooks';

export default function Component() {
    useUpdateEffect(() => {
        // do something after render
    }, []);
}
```

### usePrevious

Stores the previous value when updated.

```jsx
import React, { useState } from 'react';
import { usePrevious } from '@avidian/hooks';

export default function Component() {
    const [count, setCount] = useState(0);
    const value = usePrevious(count);

    // `value` will be 0 after `count` is updated to `1`
    setCount(1);
}
```

### useLocalStorage and useSessionStorage

Define state that maps to a storage.
`remove` sets the value to `undefined`.

```jsx
import React from 'react';
import { useLocalStorage, useSessionStorage, useStorage } from '@avidian/hooks';

export default function Component() {
    const [value, setValue, remove] = useLocalStorage('name', 'Joe');
    const [value, setValue, remove] = useSessionStorage('name', 'Joe');

    // custom storage
    const storage = new ClassThatImplementsStorageInterface();
    const [value, setValue, remove] = useStorage('name', 'Joe', storage);
}
```

## License

This library is open-sourced software licensed under the [MIT license](LICENSE).
