import React from 'react';

interface Size {
  width: number,
  height: number,
}

interface Props {
  children: ({ size }: { size: Size }) => React.ReactNode;
}

interface State {
  size: Size;
}

export class ScreenSize extends React.Component<Props, State> {
  readonly state: State = {
    size: {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  constructor(props: any, context: any) {
    super(props, context);

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.setState({
        size: {
          width,
          height,
        },
      });
    });
  }

  render() {
    const { children } = this.props;
    const { size } = this.state;
    return children({ size });
  }
}
