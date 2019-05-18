export const setState = async <TState, K extends keyof TState>(
  component: React.Component<any, TState>,
  state: (Pick<TState, K> | TState | null),
) => {
  return new Promise(resolve => {
    component.setState(state, () => resolve());
  })
};
