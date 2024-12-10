import { supabase } from '../../supabaseClient';
import { dashboardData } from './data';

/**
 * Fetch the number of strategic goals from the database.
 * @returns {Promise<number>} The count of strategic goals.
 */
export const fetchStrategicGoalsCount = async (): Promise<number> => {
    try {
        const { data, error } = await supabase.from('strategic_goals').select('id');
        if (error) throw error;
        return data.length;
    } catch (error) {
        console.error('Error fetching strategic goals:', error);
        return 0; // Default to 0 in case of error
    }
};

/**
 * Update dashboard data with the fetched count of strategic goals.
 * @returns {Promise<object>} Updated dashboard data.
 */
export const getUpdatedDashboardData = async (): Promise<object> => {
    const strategicGoalsCount = await fetchStrategicGoalsCount();

    // Clone the dashboard data and update dynamically
    const updatedDashboardData = { ...dashboardData };
    updatedDashboardData.cards[0].value = `${strategicGoalsCount} Goals`;

    return updatedDashboardData;
};
