
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'admin' | 'user';
}

export interface Note {
    id: string;
    authorId: string;
    recipientId: string;
    content: string;
    status: 'published' | 'draft' | 'archived';
    createdAt: string; // ISO string
}

export const USERS: User[] = [
    {
        id: 'u1',
        name: 'Alice Chen',
        email: 'alice@teamboost.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        role: 'admin',
    },
    {
        id: 'u2',
        name: 'Bob Smith',
        email: 'bob@teamboost.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        role: 'user',
    },
    {
        id: 'u3',
        name: 'Charlie Davis',
        email: 'charlie@teamboost.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
        role: 'user',
    },
    {
        id: 'u4',
        name: 'Diana Evans',
        email: 'diana@teamboost.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
        role: 'user',
    },
];

export const NOTES: Note[] = [
    {
        id: 'n1',
        authorId: 'u1',
        recipientId: 'u2',
        content: 'Great job on the quarterly report presentation! The data visualization really helped clarify the growth metrics.',
        status: 'published',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: 'n2',
        authorId: 'u3',
        recipientId: 'u1',
        content: 'Thanks for helping me troubleshoot that API issue yesterday. Your insights were invaluable.',
        status: 'published',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: 'n3',
        authorId: 'u2',
        recipientId: 'u4',
        content: 'Welcome to the team, Diana! Looking forward to collaborating on the new marketing campaign.',
        status: 'published',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
        id: 'n4',
        authorId: 'u4',
        recipientId: 'u2',
        content: 'Thank you for the warm welcome! Excited to be here.',
        status: 'published',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), // 2 days ago
    },
    {
        id: 'n5',
        authorId: 'u1',
        recipientId: 'u3',
        content: 'Consistently hitting deadlines. Keep up the good work on the backend refactor.',
        status: 'published',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    },
];

export function getUserById(id: string): User | undefined {
    return USERS.find((user) => user.id === id);
}

export function getNotesWithRelations() {
    return NOTES.map((note) => {
        const author = getUserById(note.authorId);
        const recipient = getUserById(note.recipientId);
        return {
            ...note,
            author,
            recipient,
        };
    });
}
