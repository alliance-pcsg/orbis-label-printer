# orbis-label-printer
 
This Cloud App developed by the Orbis Cascade Alliance generates individual spine labels to send to a label printer. A Settings page allows users to adjust fonts, margins, and label sizes, and a Configuration page allows administrators to set label prefixes by library and location.

## Generate Labels

To generate a spine label, navigate to a screen with a single item. Possible paths include...

- Scanning a barcode into a Physical Items repository search.
- Performing a repository search by keyword, and then viewing the item list for a bibliographic record or holding. For lists with multiple items, view one item to generate the label.

Click "Print" to open the printer dialog window. Select your label printer and submit the job. Printer settings may require adjustment to format the labels as expected.

## Adjust Label Size and Appearance

In the three-dot app menu in the upper right, click the gear icon to access the Settings. Saved settings affect only the current user. Edit the fields on this page to adjust the appearance and size of the printed label, and click "Save" at the bottom to apply your changes.

### Font

- Family: Enter the name of the font on your computer, e.g., "Times New Roman" (Default: Arial)
- Size: Enter the size of the font including units, e.g., "11pt" (Default: 10pt)
- Weight: Select from the options "normal" and "bold." (Default: normal)

### Label
- Width: Enter the width of the label using decimals, including units, e.g., "3.5in" (Default: .75in)</li>
- Height: Enter the height of the label using decimals, including units, e.g., "1.9375in" (Default: 1in)</li>
- Line Height: Enter the multiplier for line spacing, e.g., "1.5" (Default: 1)</li>

### Margins
Enter the left, right, top, and bottom margin spacing including units, e.g., "0in" (Default: 0.1in)

## Configure Prefixes

In the app menu, click the wrench icon to access the configuration menu. Because configurations affect everyone in an institution, users must have at least one of the following roles to edit them:

- General System Administrator
- Acquisitions Administrator
- Catalog Administrator
- Repository Administrator

Set label prefixes for libraries and locations in the textarea, following the format "\[library name\]+\[location code\]=\[label text\]". Add one entry per line. For example...

```
My Library+gen=Stacks
My Library+rdrm=Reading Room
My Library+res=Reserves
Branch Campus+res=Branch Reserves
```

Click "Save" to apply your changes to all app users in your institution.
