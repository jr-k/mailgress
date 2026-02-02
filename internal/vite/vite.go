package vite

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"sync"
)

type ManifestEntry struct {
	File    string   `json:"file"`
	Name    string   `json:"name,omitempty"`
	Src     string   `json:"src,omitempty"`
	IsEntry bool     `json:"isEntry,omitempty"`
	CSS     []string `json:"css,omitempty"`
	Imports []string `json:"imports,omitempty"`
}

type Manifest map[string]ManifestEntry

type Vite struct {
	isDev        bool
	devServerURL string
	manifestPath string
	basePath     string
	manifest     Manifest
	mu           sync.RWMutex
}

type Config struct {
	IsDev        bool
	DevServerURL string
	ManifestPath string
	BasePath     string
}

func New(cfg Config) *Vite {
	if cfg.DevServerURL == "" {
		cfg.DevServerURL = "http://localhost:5173"
	}
	if cfg.ManifestPath == "" {
		cfg.ManifestPath = "web/dist/.vite/manifest.json"
	}
	if cfg.BasePath == "" {
		cfg.BasePath = "/assets"
	}

	v := &Vite{
		isDev:        cfg.IsDev,
		devServerURL: cfg.DevServerURL,
		manifestPath: cfg.ManifestPath,
		basePath:     cfg.BasePath,
	}

	if !cfg.IsDev {
		if err := v.loadManifest(); err != nil {
			fmt.Printf("Warning: could not load Vite manifest: %v\n", err)
		}
	}

	return v
}

func (v *Vite) loadManifest() error {
	data, err := os.ReadFile(v.manifestPath)
	if err != nil {
		return fmt.Errorf("reading manifest: %w", err)
	}

	v.mu.Lock()
	defer v.mu.Unlock()

	if err := json.Unmarshal(data, &v.manifest); err != nil {
		return fmt.Errorf("parsing manifest: %w", err)
	}

	return nil
}

func (v *Vite) GenerateHTMLTags(entrypoint string) template.HTML {
	if v.isDev {
		return v.devTags(entrypoint)
	}
	return v.prodTags(entrypoint)
}

func (v *Vite) devTags(entrypoint string) template.HTML {
	return template.HTML(fmt.Sprintf(`
    <script type="module">
        import RefreshRuntime from '%s/@react-refresh'
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="%s/@vite/client"></script>
    <script type="module" src="%s/%s"></script>`,
		v.devServerURL, v.devServerURL, v.devServerURL, entrypoint))
}

func (v *Vite) prodTags(entrypoint string) template.HTML {
	v.mu.RLock()
	defer v.mu.RUnlock()

	entry, ok := v.manifest[entrypoint]
	if !ok {
		return template.HTML(fmt.Sprintf("<!-- Vite: entrypoint %q not found in manifest -->", entrypoint))
	}

	var html string

	for _, css := range entry.CSS {
		html += fmt.Sprintf(`<link rel="stylesheet" href="/%s">`, css)
	}

	for _, imp := range entry.Imports {
		if impEntry, ok := v.manifest[imp]; ok {
			html += fmt.Sprintf(`<link rel="modulepreload" href="/%s">`, impEntry.File)
		}
	}

	html += fmt.Sprintf(`<script type="module" src="/%s"></script>`, entry.File)

	return template.HTML(html)
}

func (v *Vite) GetAssetPath(asset string) string {
	if v.isDev {
		return fmt.Sprintf("%s/%s", v.devServerURL, asset)
	}

	v.mu.RLock()
	defer v.mu.RUnlock()

	if entry, ok := v.manifest[asset]; ok {
		return filepath.Join(v.basePath, entry.File)
	}

	return filepath.Join(v.basePath, asset)
}

func (v *Vite) IsDev() bool {
	return v.isDev
}
