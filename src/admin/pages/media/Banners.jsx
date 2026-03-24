import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image as ImageIcon, Trash2, Edit2, Plus } from 'lucide-react';
import { cn } from '../../layout/Sidebar';

const INITIAL_BANNERS = [
    { id: '1', title: 'Summer Sale 2024', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=200&fit=crop', status: 'Active' },
    { id: '2', title: 'New Equipment Arrival', image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&h=200&fit=crop', status: 'Active' },
    { id: '3', title: 'Season Tickets Promo', image: 'https://images.unsplash.com/photo-1508344928928-7137b29de216?w=800&h=200&fit=crop', status: 'Draft' },
];

function SortableItem({ id, banner }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-4 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-[var(--shadow-sm)] transition-all",
                isDragging && "opacity-50 ring-2 ring-[var(--ring)] shadow-[var(--shadow-lg)] scale-[1.02] z-50"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] rounded"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="h-16 w-32 flex-shrink-0 bg-[var(--muted)] rounded overflow-hidden">
                {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-[var(--muted-foreground)]" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--card-foreground)] truncate">{banner.title}</p>
                <div className="mt-1 flex items-center gap-2">
                    <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        banner.status === 'Active'
                            ? "bg-green-500/10 text-green-600 ring-green-500/20 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-[var(--muted)] text-[var(--muted-foreground)] ring-[var(--border)]"
                    )}>
                        {banner.status}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">ID: {banner.id}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] rounded-full hover:bg-[var(--primary)]/10 transition-colors">
                    <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-[var(--muted-foreground)] hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export default function Banners() {
    const [banners, setBanners] = useState(INITIAL_BANNERS);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setBanners((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                // Here you would trigger an API call to update the display_order in DB
                console.log('New Order:', newItems.map((item, index) => ({ id: item.id, display_order: index + 1 })));
                return newItems;
            });
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Banners Configuration</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Drag and drop banners to reorder how they appear on the main website storefront.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="flex items-center gap-2 block rounded-md bg-[var(--primary)] px-3 py-2 text-center text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Upload Banner
                    </button>
                </div>
            </div>

            <div className="bg-[var(--muted)]/50 p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-inner)] min-h-[400px]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={banners.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {banners.map((banner) => (
                                <SortableItem key={banner.id} id={banner.id} banner={banner} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 dark:border-blue-400 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Changes to banner ordering are saved automatically when dragging completes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
