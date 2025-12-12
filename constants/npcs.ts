import type { NPC } from '@/types/game';

export const NPCS: Record<string, NPC> = {
    'dr-qubit': {
        id: 'dr-qubit',
        name: 'Dr. Qubit',
        title: 'Lead Researcher',
        personality: 'Enthusiastic, helpful, slightly scatterbrained',
        location: 'Superposition Island',
        avatar: '🧑‍🔬',
        questsAvailable: [],
        dialogues: [
            {
                id: 'intro',
                text: 'Great Scott! A new researcher! Welcome to the Quantum Realm. I\'m Dr. Qubit. Mind the gap... the energy gap, that is!',
                emotion: 'excited',
                choices: [
                    { text: 'Nice to meet you.', nextDialogue: 'about' },
                    { text: 'Where am I?', nextDialogue: 'location' }
                ]
            },
            {
                id: 'about',
                text: 'We explore the fundamental laws of the universe here. It\'s not just 0s and 1s anymore... it\'s everything in between!',
                emotion: 'happy',
                choices: [
                    { text: 'Tell me about Superposition.', nextDialogue: 'superposition' },
                    { text: 'I\'m ready to experiment.', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'location',
                text: 'You are in the Superposition Island. Here, particles can be in multiple states at once. It\'s very confusing for my cat.',
                emotion: 'confused',
                choices: [
                    { text: 'Schrödinger\'s cat?', nextDialogue: 'cat' },
                    { text: 'Let\'s start.', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'cat',
                text: 'Exactly! Is it alive? Is it dead? Until we check, it\'s both! ...Please don\'t actually check, I haven\'t fed him today.',
                emotion: 'nervous',
                choices: [
                    { text: 'Right...', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'superposition',
                text: 'Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured. Like spinning a coin!',
                emotion: 'wise',
                choices: [
                    { text: 'Got it.', nextDialogue: 'CLOSE' }
                ]
            }
        ]
    },
    'circuit-master': {
        id: 'circuit-master',
        name: 'Sparky',
        title: 'Circuit Master',
        personality: 'Energetic, fast-talking, precise',
        location: 'Circuit City',
        avatar: '⚡',
        questsAvailable: [],
        dialogues: [
            {
                id: 'intro',
                text: 'Bzzt! Welcome to Circuit City! Input received. Processing... You need to learn about Gates?',
                emotion: 'excited',
                choices: [
                    { text: 'Yes, teach me.', nextDialogue: 'gates' },
                    { text: 'Just looking around.', nextDialogue: 'browsing' }
                ]
            },
            {
                id: 'gates',
                text: 'Gates are the building blocks! X-gate flips! H-gate creates superposition! CNOT entangles! It\'s electric!',
                emotion: 'happy',
                choices: [
                    { text: 'Slow down!', nextDialogue: 'slow' },
                    { text: 'Show me the X-gate.', nextDialogue: 'xgate' }
                ]
            },
            {
                id: 'slow',
                text: 'Cannot slow down! Frequency too high! ...Okay, think of a gate as an operation that changes the state of a qubit.',
                emotion: 'neutral',
                choices: [
                    { text: 'Better.', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'browsing',
                text: 'Browsing is inefficient. optimize your path! Execute learning protocol!',
                emotion: 'grumpy',
                choices: [
                    { text: 'Okay, okay.', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'xgate',
                text: 'The Pauli-X gate is the quantum equivalent of a NOT gate. It turns |0⟩ to |1⟩ and vice versa. Flip it!',
                emotion: 'wise',
                choices: [
                    { text: 'I will try.', nextDialogue: 'CLOSE' }
                ]
            }
        ]
    },
    'oracle': {
        id: 'oracle',
        name: 'Ada the Oracle',
        title: 'Keeper of Algorithms',
        personality: 'Mysterious, wise, speaks in riddles',
        location: 'Algorithm Temple',
        avatar: '🔮',
        questsAvailable: [],
        dialogues: [
            {
                id: 'intro',
                text: 'Welcome, seeker. You stand before the Temple of Algorithms. Here, we do not merely guess; we enhance probability itself.',
                emotion: 'mysterious',
                choices: [
                    { text: 'How does it work?', nextDialogue: 'explanation' },
                    { text: 'I am ready to learn.', nextDialogue: 'challenge' }
                ]
            },
            {
                id: 'explanation',
                text: 'Grover\'s algorithm is like finding a needle in a haystack by making the needle glow brighter, rather than checking each straw.',
                emotion: 'wise',
                choices: [
                    { text: 'Show me.', nextDialogue: 'challenge' },
                    { text: 'Sounds efficient.', nextDialogue: 'challenge' }
                ]
            },
            {
                id: 'challenge',
                text: 'Prove your worth. Navigate the maze using amplitude amplification. Only then shall the path open.',
                emotion: 'challenging',
                choices: [
                    { text: 'I accept.', nextDialogue: 'CLOSE' }
                ]
            }
        ]
    },
    'hardware-harry': {
        id: 'hardware-harry',
        name: 'Hardware Harry',
        title: 'Cryogenic Engineer',
        personality: 'Grumpy, practical, obsessed with temperature',
        location: 'Cryogenic Caverns',
        avatar: '🥶',
        questsAvailable: [],
        dialogues: [
            {
                id: 'intro',
                text: 'Don\'t touch anything! Do you have any idea how hard it is to keep these qubits at 15 millikelvin?',
                emotion: 'grumpy',
                choices: [
                    { text: 'Sorry! Just looking.', nextDialogue: 'explanation' },
                    { text: 'Why so cold?', nextDialogue: 'cold-reason' }
                ]
            },
            {
                id: 'cold-reason',
                text: 'Heat is noise! Noise kills quantum states! One warm breeze and POOF—decoherence. All our work gone.',
                emotion: 'excited',
                choices: [
                    { text: 'I\'ll be careful.', nextDialogue: 'task' }
                ]
            },
            {
                id: 'explanation',
                text: 'These dilution refrigerators are marvels of engineering. We use a mix of Helium-3 and Helium-4 to strip away heat.',
                emotion: 'wise',
                choices: [
                    { text: 'Fascinating.', nextDialogue: 'task' }
                ]
            },
            {
                id: 'task',
                text: 'Since you\'re here, check the mixing chamber stats. And don\'t breathe on the wiring!',
                emotion: 'challenging',
                choices: [
                    { text: 'On it, Harry.', nextDialogue: 'CLOSE' }
                ]
            }
        ]
    },
    'entangla': {
        id: 'entangla',
        name: 'Entangla',
        title: 'Weaver of Connections',
        personality: 'Connected, ethereal, empathetic',
        location: 'Entanglement Valley',
        avatar: '🔗',
        questsAvailable: [],
        dialogues: [
            {
                id: 'intro',
                text: 'I felt you arriving before you even stepped here. We are all connected in the great web of spacetime.',
                emotion: 'happy',
                choices: [
                    { text: 'Spooky!', nextDialogue: 'spooky' },
                    { text: 'Explain entanglement.', nextDialogue: 'explanation' }
                ]
            },
            {
                id: 'spooky',
                text: 'Einstein thought so too. "Spooky action at a distance." But it is just how the universe sings in harmony.',
                emotion: 'wise',
                choices: [
                    { text: 'Teach me the song.', nextDialogue: 'CLOSE' }
                ]
            },
            {
                id: 'explanation',
                text: 'When two hearts—or qubits—are entangled, they share a single destiny. Changing one instantly defines the other.',
                emotion: 'mysterious',
                choices: [
                    { text: 'Let\'s try it.', nextDialogue: 'CLOSE' }
                ]
            }
        ]
    }
};
