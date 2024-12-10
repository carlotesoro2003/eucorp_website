import { supabase } from '../../supabaseClient';

/**
 * Dashboard data structure.
 */
export const dashboardData = {
    cards: [
        {
            title: 'Strategic Goals',
            value: '0 Goals', // Placeholder for dynamic value
            change: 12.5,
            icon: '💰',
        },
        {
            title: 'Unmitigated Risks',
            value: '0 Risks', // Placeholder for dynamic value
            change: -2.4,
            icon: '📊',
        },
        {
            title: 'Opportunities',
            value: '0 Opportunities', // Placeholder for dynamic value
            change: 8.2,
            icon: '👥',
        },
        {
            title: 'Users',
            value: '0 Users', // Placeholder for dynamic value
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
        categories: ['Manpower', 'Financial', 'Technical', 'Operational'], // Ensure this exists
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


/**
 * Fetch and update the count of strategic goals directly in the dashboardData object.
 */
export const updateStrategicGoalsCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase.from('strategic_goals').select('id');
        if (error) throw error;

        const strategicGoalsCount = data.length;
        dashboardData.cards[0].value = `${strategicGoalsCount}`;
    } catch (error) {
        console.error('Error updating strategic goals count:', error);
        dashboardData.cards[0].value = '0 Goals';
    }
};

/**
 * Fetch and update the count of unmitigated risks directly in the dashboardData object.
 */
export const updateUnmitigatedRisksCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('risk_monitoring')
            .select('id', { count: 'exact' })
            .eq('is_achieved', false);

        if (error) throw error;

        const unmitigatedRisksCount = data.length;
        dashboardData.cards[1].value = `${unmitigatedRisksCount}`;
    } catch (error) {
        console.error('Error updating unmitigated risks count:', error);
        dashboardData.cards[1].value = '0 Risks';
    }
};

/**
 * Fetch and update the count of opportunities directly in the dashboardData object.
 */
export const updateOpportunitiesCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase.from('opportunities').select('id');
        if (error) throw error;

        const opportunitiesCount = data.length;
        dashboardData.cards[2].value = `${opportunitiesCount}`;
    } catch (error) {
        console.error('Error updating opportunities count:', error);
        dashboardData.cards[2].value = '0 Opportunities';
    }
};

/**
 * Fetch and update the count of users directly in the dashboardData object.
 */
export const updateUsersCount = async (): Promise<void> => {
    try {
        const { data, error } = await supabase.from('profiles').select('id');
        if (error) throw error;

        const usersCount = data.length;
        dashboardData.cards[3].value = `${usersCount}`;
    } catch (error) {
        console.error('Error updating users count:', error);
        dashboardData.cards[3].value = '0 Users';
    }
};
