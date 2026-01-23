import h from 'https://unpkg.com/htm@latest?module';

const UlluPreview = createClass({
    render: function () {
        const entry = this.props.entry;
        const body = entry.getIn(["data", "body"]);
        const author = entry.getIn(["data", "author"]) || "observer";
        const date = entry.getIn(["data", "date"]);

        // Using inline styles to ensure the preview renders correctly in the iframe
        // without relying on external Tailwind classes passing through
        return h`
      <div style="
        padding: 40px;
        background: #0c0c0c;
        color: #e6e6e6;
        font-family: 'VT323', monospace;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 100%;
          max-width: 400px;
          background: #111;
          padding: 30px;
          border-radius: 4px;
          border: 1px solid #222;
          box-shadow: 0 0 20px rgba(94, 43, 255, 0.1);
        ">
          <div style="font-size: 14px; opacity: 0.6; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px;">
            ${date ? date.toString() : 'NO DATE'}
          </div>

          <pre style="
            white-space: pre-wrap;
            font-size: 18px;
            color: #ccc;
            line-height: 1.6;
            font-family: 'VT323', monospace;
          ">${body}</pre>

          <p style="
            margin-top: 30px;
            text-align: right;
            color: #5e2bff;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">
            // OBSERVED BY ${author}
          </p>
        </div>
      </div>
    `;
    }
});

CMS.registerPreviewTemplate("ullu", UlluPreview);
CMS.registerPreviewStyle("./custom.css");
