/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
import { Constructable } from 'Type/Constructable';
import { SimpleComponent } from 'Util/SimpleComponent';

export const renderHOC = <P, T, N extends string>(
    Component: Constructable<SimpleComponent<T>>,
    logicHook: (props: P) => T,
    displayName?: N
): React.FC<P> => {
    const FunctionalComponent = (props: P): JSX.Element => {
        const componentProps = logicHook(props);
        const renderComponent = new Component(componentProps);

        return renderComponent.render() as JSX.Element;
    };

    if (displayName) {
        FunctionalComponent.displayName = displayName;
    }

    /**
     * For react to understand that this should be treated like any other component component
     * we need to execute it like this.
     * */
    return (props: P) => <FunctionalComponent { ...props } />;
};
