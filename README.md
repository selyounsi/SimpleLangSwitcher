
# SimpleLangSwitcher

## What is the LangSwitcher?

The **LangSwitcher** is a JavaScript tool designed to dynamically output language links at a desired location on a website. This feature is particularly useful for multilingual projects with many subpages, as the LangSwitcher simplifies navigation between language versions. Visitors can easily switch between the different language versions of a page, while editors can maintain and update navigation links more efficiently.

## How does the LangSwitcher work?

To correctly identify and link subpages, the script relies on a **mapping system** that assigns an identifier (ID) to each URL. These identifiers establish the connections between the language versions of a page.

### Example:
When you are on the German page "Anfahrt" (Directions), the LangSwitcher dynamically links to the English version "Directions" and the French version "Accès." The generated links look like this:

- **German:** `/anfahrt`
- **English:** `/en/directions`
- **French:** `/fr/directions`

### Fallback:
If a page does not have a corresponding ID in another language, the script automatically links to the homepage or the first defined page of that language.

---

## How to use the LangSwitcher?

### Generating the HTML Structure Using a Custom Class

In **line 1** of the script, you specify where the HTML structure with the language links should be output. You need to define the path to the desired HTML element.

**Example:**
```javascript
var langSwitcher = new LangSwitcher(".langContainer", { ... });
```

Now, the LangSwitcher should be visible on the page, generating the following HTML structure:

```html
<div class="langContainer">
    <ul class="lang-switcher page-de">
        <li class="de active">
            <a title="de" href="/">de</a>
        </li>
        <li class="en">
            <a title="en" href="/en/">en</a>
        </li>
        <li class="fr">
            <a title="fr" href="/fr/">fr</a>
        </li>
    </ul>
</div>
```

### Mapping and Page Values

The mapping controls the connections between the pages. Each language has its own section in the mapping. To add a new language, duplicate an existing section and adjust the language code and page paths accordingly. The language code should always match the `lang=""` attribute specified in the HTML element of each page.

**Example:**
```html
<html lang="en" data-fw-version="1.3">
```

The mapping snippet below includes standard pages such as Directions, Contact, and Legal Notice. You can add the remaining project-specific pages, ensuring the identifiers match across languages.

**Example Mapping:**
```javascript
var langSwitcher = new LangSwitcher(".langContainer", {
    mapping: {
        de: {
            "/": 100,
            "/anfahrt": 110,
            "/kontakt/": 120,
            "/impressum": 150,
        },
        en: {
            "/en/": 100,
            "/en/directions": 110,
            "/en/contact/": 120,
            "/en/legal-notice": 150,
        },
        fr: {
            "/fr/": 100,
            "/fr/directions": 110,
            "/fr/contact/": 120,
            "/fr/legal-notice": 150,
        }
    }
});
```

### LangSwitcher Error Messages

The LangSwitcher provides error messages when mapping errors occur, helping users avoid broken navigation links.

---

## What options can be configured?

### Placeholder for Optimized Loading

Since JavaScript often loads after the main page content, there may be a delay of 1–2 seconds before the language links become visible. To improve the user experience, you can add a placeholder that is later replaced by the script.

**Example:**
```html
<div class="langContainer">
    <ul class="lang-switcher">
        <li class="de active">
            <a title="de" href="/">de</a>
        </li>
        <li class="en">
            <a title="en" href="/en/">en</a>
        </li>
        <li class="fr">
            <a title="fr" href="/fr/">fr</a>
        </li>
    </ul>
</div>
```

### Changing the List's Class Name

You can change the CSS class of the generated list using the `listClass` option. This allows you to style the LangSwitcher differently depending on its location.

**Example:**
```javascript
var langSwitcher = new LangSwitcher(".langContainer", {
    listClass: "custom-class",
    ...
});
```

### Title Attribute

With the `title: true` option, you can control whether the `title` attributes are included in the language links. These titles are automatically loaded from each page but may increase loading time. Using a placeholder is recommended to optimize performance.

**Example:**
```javascript
var langSwitcher = new LangSwitcher(".langContainer", {
    title: true,
    ...
});
```