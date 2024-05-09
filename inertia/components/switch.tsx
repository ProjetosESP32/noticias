import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components'

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children: React.ReactNode
}

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props}>
      <div className="indicator" />
      {children}
    </AriaSwitch>
  )
}
