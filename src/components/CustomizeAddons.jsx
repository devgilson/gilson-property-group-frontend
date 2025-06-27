import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronRight } from 'lucide-react';

const addonsList = [
    {
        id: 'housekeeping',
        title: 'Housekeeping',
        price: 100,
        frequencyOptions: ['Daily', 'Weekly', 'Bi-weekly'],
    },
    { id: 'spa', title: 'Spa Services', price: 150 },
    { id: 'chef', title: 'Private Chef', price: 200 },
    { id: 'grocery', title: 'Grocery Delivery', price: 50 },
    { id: 'baby', title: 'Baby Equipment Rentals', price: 75 },
    { id: 'tours', title: 'Guided Tours', price: 100 },
];

const CustomizeAddons = ({ onBack, onProceed }) => {
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [housekeepingFrequency, setHousekeepingFrequency] = useState('');

    const toggleAddon = (id) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedAddons.includes(id);

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h2 className="text-2xl font-bold mb-6">Customize your stay</h2>
            <p className="text-lg font-semibold">(GPG Owned) #E2 River Mountain Lodge Resort</p>
            <p className="mb-6 text-gray-600">Dates: 2025-07-14 to 2025-07-17</p>

            <div className="grid gap-4">
                {addonsList.map((addon) => (
                    <Card
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`cursor-pointer transition border-2 ${
                            isSelected(addon.id) ? 'border-black' : 'border-gray-200'
                        }`}
                    >
                        <CardContent className="flex justify-between items-center p-4">
                            <div>
                                <h3 className="font-semibold text-lg">{addon.title}</h3>
                                <p className="text-gray-600">${addon.price}</p>
                            </div>
                            {isSelected(addon.id) && <Check className="text-green-600" />}
                        </CardContent>

                        {addon.id === 'housekeeping' && isSelected('housekeeping') && (
                            <div className="px-4 pb-4 space-y-2">
                                <p className="font-medium text-gray-700">Select Frequency:</p>
                                <div className="flex gap-4">
                                    {addon.frequencyOptions.map((option) => (
                                        <label key={option} className="flex items-center gap-1 text-sm">
                                            <input
                                                type="radio"
                                                name="housekeepingFrequency"
                                                value={option}
                                                checked={housekeepingFrequency === option}
                                                onChange={(e) => setHousekeepingFrequency(e.target.value)}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div className="flex justify-between mt-8">
                <Button variant="secondary" onClick={onBack}>Back</Button>
                <Button onClick={() => onProceed(selectedAddons, housekeepingFrequency)}>
                    Proceed to Payment <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default CustomizeAddons;
