import { h, Component } from 'preact'

import ErrorPlace from '@/ui-kit/ErrorPlace'

import './select.scss'

function getItems(children) {
  const items = []
  if (Array.isArray(children)) {
    children.forEach((ch) => {
      items.push(ch)
    })
  } else {
    items.push(children)
  }
  return items
}

function getDefSelectValue(value) {
  let ret = -1
  getItems(this.props.children).forEach((item, idx) => {
    if (value == item.props.eventKey) {
      ret = idx
    }
  })
  return ret
}

export default class Select extends Component {
  onChange = (e) => {
    const idx = e.target.value
    const items = getItems(this.props.children)
    const item = items[idx]
    if (item) {
      const val = item.props.eventKey
      this.props.onSelect && this.props.onSelect(val)
    }
  }

  render() {
    const { className, children, setRef, underline, name, onChange, value, error, ...etcProps } =
      this.props
    setRef && (etcProps.ref = setRef)

    const items = getItems(children)
    const defValue = getDefSelectValue.call(this, this.props.value)

    return (
      <div className={`field-select ${className || ''} ${underline ? 'with-underline' : ''}`}>
        <select onChange={this.onChange} value={defValue} prev={defValue} name={name} {...etcProps}>
          {items.map((item, idx) => (
            <option key={idx} value={idx}>
              {item}
            </option>
          ))}
        </select>
        <div className="field-footer">{error && <ErrorPlace>{error}</ErrorPlace>}</div>
      </div>
    )
  }
}
