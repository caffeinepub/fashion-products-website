import { Button } from './ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === 'All' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('All')}
        className="rounded-full"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
