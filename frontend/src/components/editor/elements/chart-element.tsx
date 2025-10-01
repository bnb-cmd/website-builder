import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface ChartElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function ChartElement({ element, onUpdate, viewMode, style }: ChartElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getChartIcon = () => {
    switch (element.props.type) {
      case 'bar':
        return <BarChart3 className="h-8 w-8 text-blue-600" />
      case 'pie':
        return <PieChart className="h-8 w-8 text-green-600" />
      case 'line':
        return <TrendingUp className="h-8 w-8 text-purple-600" />
      default:
        return <BarChart3 className="h-8 w-8 text-blue-600" />
    }
  }

  const getChartHeight = () => {
    const height = element.props.height || 'medium'
    switch (height) {
      case 'small':
        return 'h-48'
      case 'medium':
        return 'h-64'
      case 'large':
        return 'h-80'
      case 'xl':
        return 'h-96'
      default:
        return 'h-64'
    }
  }

  const getChartType = () => {
    return element.props.type || 'bar'
  }

  const getDataPoints = () => {
    return element.props.data || [
      { label: 'Jan', value: 65 },
      { label: 'Feb', value: 59 },
      { label: 'Mar', value: 80 },
      { label: 'Apr', value: 81 },
      { label: 'May', value: 56 },
      { label: 'Jun', value: 55 }
    ]
  }

  const renderChartPreview = () => {
    const data = getDataPoints()
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="w-full h-full flex flex-col">
        {/* Chart Title */}
        <div
          className="text-lg font-semibold text-center mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Chart Title'}
        </div>
        
        {/* Chart Preview */}
        <div className="flex-1 flex items-end justify-center space-x-2 p-4">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{
                  width: '20px',
                  height: `${(point.value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`${point.label}: ${point.value}`}
              />
              <span className="text-xs text-gray-600 mt-1">{point.label}</span>
            </div>
          ))}
        </div>
        
        {/* Chart Info */}
        <div className="text-xs text-gray-500 text-center mt-2">
          Type: {getChartType()} | Data Points: {data.length}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full bg-white border border-gray-200 rounded-lg overflow-hidden',
        getChartHeight()
      )}
      style={style}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {getChartIcon()}
          <span className="font-medium text-gray-700 capitalize">
            {getChartType()} Chart
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Interactive Chart
        </div>
      </div>
      
      {/* Chart Content */}
      <div className="p-4 h-full">
        {renderChartPreview()}
      </div>
      
      {/* Integration Note */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Configure with Chart.js
      </div>
    </div>
  )
}
