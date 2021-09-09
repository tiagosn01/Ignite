import { useEffect, useState } from "react"

export function Async() {
  const [buttonIsVisible, setButtonIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setButtonIsVisible(false)
    }, 1000);
  }, [])

  return (
    <div>
      <div>Hello</div>
      {buttonIsVisible && (
      <button>Button</button>
      )}
    </div>
  )
}