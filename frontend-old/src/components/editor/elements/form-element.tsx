import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface FormElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function FormElement({ element, onUpdate, viewMode, style }: FormElementProps) {
  const fields = element.props.fields || [
    { type: 'text', label: 'Name', required: true },
    { type: 'email', label: 'Email', required: true },
    { type: 'textarea', label: 'Message', required: true }
  ]

  return (
    <div style={style} className="max-w-md mx-auto p-6 bg-white border border-border rounded-lg">
      <h3 
        className="text-xl font-semibold mb-4 outline-none"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate(element.id, {
          props: { ...element.props, title: e.target.innerText }
        })}
        dangerouslySetInnerHTML={{ __html: element.props.title || 'Contact Form' }}
      />
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field: any, index: number) => (
          <div key={index}>
            <Label htmlFor={`field-${index}`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={`field-${index}`}
                placeholder={field.placeholder || field.label}
                required={field.required}
                className="mt-1"
              />
            ) : (
              <Input
                id={`field-${index}`}
                type={field.type}
                placeholder={field.placeholder || field.label}
                required={field.required}
                className="mt-1"
              />
            )}
          </div>
        ))}
        
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  )
}
