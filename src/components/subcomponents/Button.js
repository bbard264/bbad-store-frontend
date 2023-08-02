import React from 'react'
import '../../styles/components/subcomponents/Button.css'

function Button({type,form, onClick , children}) {

  return (
    <button className={`Button${` `+type}`} type={type} form={form} onClick={onClick}>{children}</button>
  )
}

export default Button