// Documentation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-section a');
    const sections = document.querySelectorAll('.doc-section');
    const sidebar = document.querySelector('.docs-sidebar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Update active link based on scroll
    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Smooth scrolling for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // Code tabs functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabGroup = button.parentElement.parentElement;
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active from all buttons and panes in this group
            tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabGroup.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = tabGroup.querySelector(`#${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Copy code functionality
    document.querySelectorAll('pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        wrapper.style.position = 'relative';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        
        button.addEventListener('click', async () => {
            const code = pre.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                button.textContent = 'Copied!';
                button.style.color = '#10b981';
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.style.color = '#94a3b8';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
        
        wrapper.appendChild(button);
    });
    
    // Search functionality (optional enhancement)
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search documentation...';
    searchInput.className = 'docs-search';
    // Remove inline styles since we have them in CSS now
    
    // Insert search at the top of sidebar
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.insertBefore(searchInput, sidebarContent.firstChild);
    
    // Simple search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.sidebar-section').forEach(section => {
            const links = section.querySelectorAll('a');
            let hasVisibleLinks = false;
            
            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    link.style.display = 'block';
                    hasVisibleLinks = true;
                } else {
                    link.style.display = 'none';
                }
            });
            
            // Hide section if no visible links
            section.style.display = hasVisibleLinks ? 'block' : 'none';
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    
    // Table of contents for current section
    function generateTOC() {
        const activeSection = document.querySelector('.doc-section:target') || 
                            document.querySelector('.doc-section');
        
        if (!activeSection) return;
        
        const headings = activeSection.querySelectorAll('h2, h3');
        if (headings.length === 0) return;
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>On this page</h4><ul></ul>';
        
        const list = toc.querySelector('ul');
        
        headings.forEach(heading => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-')}`;
            a.textContent = heading.textContent;
            a.className = heading.tagName.toLowerCase();
            li.appendChild(a);
            list.appendChild(li);
        });
        
        // Add TOC to the page (you can position this where needed)
        // For now, we'll skip this feature
    }
    
    // Syntax highlighting for inline code
    document.querySelectorAll('code:not(pre code)').forEach(code => {
        if (code.textContent.startsWith('--') || code.textContent.startsWith('-')) {
            code.style.color = 'var(--primary-color)';
        }
    });
});

// Add smooth loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});