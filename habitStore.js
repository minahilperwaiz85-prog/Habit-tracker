
const STORAGE_KEY = "habits";

class HabitStore {

    static instance;

    constructor() {

        // Singleton Pattern
        if (HabitStore.instance) {
            return HabitStore.instance;
        }

        const data = localStorage.getItem(STORAGE_KEY);

        let savedHabits = [];

        try {
            savedHabits = data && data !== "undefined"
                ? JSON.parse(data)
                : [];
        } catch (error) {
            savedHabits = [];
        }

        // Symbol creates unique internal ID
        this.habits = savedHabits.map(habit => ({
            ...habit,
           storageId: habit.storageId || String(habit.id || crypto.randomUUID()),
    id: Symbol(habit.name)
        }));

        // Observer subscribers
        this.observers = new Set();

        HabitStore.instance = this;
    }

    // Observer Pattern
    subscribe(observer) {
        this.observers.add(observer);
    }

    notify() {
        this.observers.forEach(observer => observer(this.habits));
    }

    save() {
        const data = this.habits.map(habit => ({
            storageId: habit.storageId,
            name: habit.name,
            completed: habit.completed
        }));

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    }

    addHabit(name) {

        const habit = {
            id: Symbol(name),
            storageId: crypto.randomUUID(),
            name: name,
            completed: false
        };

        this.habits.push(habit);

        this.save();
        this.notify();
    }

    toggleHabit(storageId) {

        const habit = this.habits.find(
            item => item.storageId === storageId
        );

        if (habit) {
            habit.completed = !habit.completed;
            this.save();
            this.notify();
        }
    }

    deleteHabit(storageId) {

    this.habits = this.habits.filter(
        item => item.storageId !== storageId
    );

    this.save();
    this.notify();
}

    getHabits() {
        return this.habits;
    }
}

// Only one instance
export const habitStore = new HabitStore();
