import type { ComponentType, FC, ReactNode } from 'react'

type HOCFunction<P extends object> = (a: ComponentType<P>) => FC<P>

export function composeHOC<P extends object>(
  Component: ComponentType<P>,
  ...hocs: HOCFunction<P>[]
): ComponentType<P> {
  return hocs.reverse().reduce((acc, hoc) => hoc(acc), Component)
}

export function withComponent<P extends object>(
  Component: ComponentType<P>,
  HOC: ComponentType<{ children: ReactNode } & P>
): ComponentType<P> {
  const ComponentWithHoc = (props: P) => (
    <HOC {...props}>
      <Component {...props} />
    </HOC>
  )

  return ComponentWithHoc
}

export function withComponents<P extends object>(
  Component: ComponentType<P>,
  ...hocComponents: ComponentType<{ children: ReactNode } & P>[]
) {
  return hocComponents.reverse().reduce((acc, cp) => withComponent(acc, cp), Component)
}
