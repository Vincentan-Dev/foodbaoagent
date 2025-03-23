class FooterComponent extends HTMLElement {
  constructor() {
    super();
    
    this.innerHTML = `
      <style>
        /* Minimal footer styling */
        .app-footer {
          padding: 8px 0;
          background-color: #f5f5f5;
          color: #757575;
          text-align: center;
          font-size: 11px;
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 900;
          border-top: 1px solid #e0e0e0;
        }
        
      </style>
      
      <footer class="app-footer">
        <div class="container">
          © ${new Date().getFullYear()} 福宝熊猫 Food Bao Panda
        </div>
      </footer>
    `;
  }
}

// Register the custom element
customElements.define('app-footer', FooterComponent);