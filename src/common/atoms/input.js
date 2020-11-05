const Input = ({
  className,
  type='text',
  value,
  onChange
})=>{
  return (
    <input
     className= { className }
     type= { type }
     value = { value }
     onChange = { onChange }
    />
  )
}

export default Input;