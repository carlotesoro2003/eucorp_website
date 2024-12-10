export const dashboardData = {
    cards: [
        {
            title: 'Strategic Goals',
            value: '0',
            change: 12.5,
            icon: '💰',
        },
        {
            title: 'Risks Identified',
            value: '45',
            change: -2.4,
            icon: '📊',
        },
        {
            title: 'Opportunities',
            value: '128',
            change: 8.2,
            icon: '👥',
        },
        {
            title: 'Users',
            value: '92%',
            change: 5.1,
            icon: '✅',
        },
    ],
    barChart: {
        goals: [
            'Strategic Goal 1',
            'Strategic Goal 2',
            'Strategic Goal 3',
            'Strategic Goal 4',
            'Strategic Goal 5',
        ],
        achieved: [75, 60, 85, 45, 65],
        notAchieved: [25, 40, 15, 55, 35],
    },
    riskData: {
        categories: ['Manpower', 'Financial', 'Technical', 'Operational'],
        datasets: {
            manpower: [30, 50, 20],
            financial: [45, 35, 20],
            technical: [25, 45, 30],
            operational: [35, 40, 25],
        },
    },
    recentEvents: [
        {
            title: 'New project milestone achieved',
            time: '2 hours ago',
            type: 'success',
        },
        {
            title: 'System maintenance scheduled',
            time: '5 hours ago',
            type: 'warning',
        },
        {
            title: 'Server capacity reached 90%',
            time: '8 hours ago',
            type: 'error',
        },
        {
            title: 'New team member onboarded',
            time: '1 day ago',
            type: 'success',
        },
    ],
};
