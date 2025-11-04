// ============================================
// TRANSACTIONS DATA MANAGEMENT
// ============================================

// Mock transactions data - Easy to replace with RPC data
// When integrating with RPC, replace this array with API calls
const mockTransactions = [
    // Generate 100 mock transactions
    ...Array.from({ length: 100 }, (_, i) => {
        const types = ['Payment', '402Pay', 'Subscription'];
        const tokens = ['USDT', 'USDC', 'BNB', 'FDUSD'];
        const chains = ['BNB Chain', 'opBNB'];
        const statuses = ['Success', 'Pending', 'Failed'];

        const type = types[Math.floor(Math.random() * types.length)];
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const chain = chains[Math.floor(Math.random() * chains.length)];
        const status = i < 95 ? 'Success' : (i < 98 ? 'Pending' : 'Failed'); // 95% success rate

        const amount = type === '402Pay'
            ? (Math.random() * 5 + 0.1).toFixed(2)
            : type === 'Subscription'
            ? (Math.random() * 50 + 9.99).toFixed(2)
            : (Math.random() * 500 + 5).toFixed(2);

        const minutesAgo = i * 3 + Math.floor(Math.random() * 3);
        const timestamp = Date.now() - (minutesAgo * 60 * 1000);

        return {
            hash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
            fullHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            type,
            amount: parseFloat(amount),
            token,
            chain,
            status,
            timestamp,
            timeAgo: formatTimeAgo(timestamp)
        };
    })
];

// State management
let currentPage = 1;
let itemsPerPage = 10;
let filteredTransactions = [...mockTransactions];
let currentFilter = 'all';
let searchQuery = '';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function getStatusColor(status) {
    switch (status) {
        case 'Success': return 'bg-green-500/10 text-green-400';
        case 'Pending': return 'bg-yellow-500/10 text-yellow-400';
        case 'Failed': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

function getTypeColor(type) {
    switch (type) {
        case '402Pay': return 'bg-purple-500/10 text-purple-400';
        case 'Payment': return 'bg-blue-500/10 text-blue-400';
        case 'Subscription': return 'bg-orange-500/10 text-orange-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

// ============================================
// FILTER AND SEARCH FUNCTIONS
// ============================================

function applyFiltersAndSearch() {
    // Start with all transactions
    let result = [...mockTransactions];

    // Apply type filter
    if (currentFilter !== 'all') {
        result = result.filter(tx => tx.type === currentFilter);
    }

    // Apply search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(tx =>
            tx.hash.toLowerCase().includes(query) ||
            tx.fullHash.toLowerCase().includes(query) ||
            tx.type.toLowerCase().includes(query) ||
            tx.amount.toString().includes(query) ||
            tx.token.toLowerCase().includes(query) ||
            tx.chain.toLowerCase().includes(query)
        );
    }

    filteredTransactions = result;
    currentPage = 1; // Reset to first page when filters change
    renderTransactions();
    renderPagination();
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);

    if (pageTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p class="text-gray-400 text-lg">No transactions found</p>
                        <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                </td>
            </tr>
        `;
        updateResultsInfo();
        return;
    }

    tbody.innerHTML = pageTransactions.map(tx => `
        <tr class="hover:bg-bnb-dark transition">
            <td class="px-6 py-4">
                <span class="font-mono text-sm text-bnb-yellow cursor-pointer hover:underline" title="${tx.fullHash}">
                    ${tx.hash}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(tx.type)}">
                    ${tx.type}
                </span>
            </td>
            <td class="px-6 py-4 font-semibold">$${tx.amount.toFixed(2)}</td>
            <td class="px-6 py-4 text-gray-400">${tx.token}</td>
            <td class="px-6 py-4">
                <span class="text-sm">${tx.chain}</span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}">
                    ${tx.status}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-400 text-sm">${tx.timeAgo}</td>
        </tr>
    `).join('');

    updateResultsInfo();
}

function updateResultsInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredTransactions.length);
    const total = filteredTransactions.length;

    document.getElementById('results-info').textContent =
        total === 0 ? '0 of 0' : `${startIndex}-${endIndex} of ${total}`;
}

function renderPagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // Update page display
    document.getElementById('current-page-display').textContent = currentPage;
    document.getElementById('total-pages-display').textContent = totalPages;

    // Enable/disable prev and next buttons
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;

    // Generate page numbers
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Show limited pages with ellipsis
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    pageNumbersContainer.innerHTML = pageNumbers.map(num => {
        if (num === '...') {
            return `<span class="px-3 py-2 text-gray-500">...</span>`;
        }

        const isActive = num === currentPage;
        return `
            <button
                class="page-num-btn px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    isActive
                        ? 'bg-bnb-yellow text-bnb-dark'
                        : 'bg-bnb-gray text-gray-300 hover:bg-bnb-yellow hover:text-bnb-dark'
                }"
                data-page="${num}"
            >
                ${num}
            </button>
        `;
    }).join('');

    // Add event listeners to page number buttons
    document.querySelectorAll('.page-num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderTransactions();
            renderPagination();
            scrollToTop();
        });
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderTransactions();
    renderPagination();

    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFiltersAndSearch();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-bnb-yellow', 'text-bnb-dark');
                b.classList.add('bg-bnb-dark', 'text-gray-300');
            });
            this.classList.remove('bg-bnb-dark', 'text-gray-300');
            this.classList.add('bg-bnb-yellow', 'text-bnb-dark');

            // Apply filter
            currentFilter = this.dataset.filter;
            applyFiltersAndSearch();
        });
    });

    // Pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
            renderPagination();
            scrollToTop();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
            renderPagination();
            scrollToTop();
        }
    });

    // Items per page selector
    document.getElementById('per-page').addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTransactions();
        renderPagination();
    });
});

// ============================================
// INTEGRATING WITH RPC - INSTRUCTIONS
// ============================================
/*
To integrate with your RPC URL, replace the mockTransactions array with API calls.

Example integration:

const RPC_URL = 'YOUR_RPC_URL_HERE';

async function fetchTransactions() {
    try {
        const response = await fetch(`${RPC_URL}/api/transactions`);
        const data = await response.json();

        return data.transactions.map(tx => ({
            hash: tx.hash.substring(0, 6) + '...' + tx.hash.substring(tx.hash.length - 4),
            fullHash: tx.hash,
            type: tx.type, // '402Pay', 'Payment', or 'Subscription'
            amount: parseFloat(tx.amount),
            token: tx.token,
            chain: tx.chainId === 56 ? 'BNB Chain' : 'opBNB',
            status: tx.status, // 'Success', 'Pending', or 'Failed'
            timestamp: tx.timestamp,
            timeAgo: formatTimeAgo(tx.timestamp)
        }));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

// Then replace the mockTransactions initialization:
let allTransactions = [];

async function initializeTransactions() {
    allTransactions = await fetchTransactions();
    filteredTransactions = [...allTransactions];
    renderTransactions();
    renderPagination();
}

// Call this on page load:
document.addEventListener('DOMContentLoaded', () => {
    initializeTransactions();
    // ... rest of event listeners
});

// Optional: Auto-refresh transactions every 10 seconds
setInterval(async () => {
    allTransactions = await fetchTransactions();
    applyFiltersAndSearch(); // Reapply current filters
}, 10000);
*/
