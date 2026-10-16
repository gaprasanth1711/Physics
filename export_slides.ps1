$pairs = @(
    @{
        src = "E:\website\NARAYANA PPTS 11 AND 12\12th-phy\1-electric-charges-and-fields\PHY SR ECF M01 ELECTRIC CHARGE(26 May 2016).pptx";
        dest = "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\public\slides\12-electric-charge"
    },
    @{
        src = "E:\website\NARAYANA PPTS 11 AND 12\11th-phy\3-motion-in-a-straight-line\01 INTRODUCTION.pptx";
        dest = "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\public\slides\11-motion-in-a-straight-line"
    }
)

$ppt = New-Object -ComObject PowerPoint.Application
try {
    foreach ($p in $pairs) {
        $src = $p.src
        $dest = $p.dest
        if (-not (Test-Path $dest)) {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        }
        Write-Output "Exporting: $src"
        $pres = $ppt.Presentations.Open($src, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $count = $pres.Slides.Count
        for ($i = 1; $i -le $count; $i++) {
            $pad = $i.ToString("00")
            $outPath = Join-Path $dest "slide_$pad.jpg"
            $pres.Slides.Item($i).Export($outPath, "JPG", 1920, 1080)
        }
        $pres.Close()
        Write-Output "Completed $count slides -> $dest"
    }
} finally {
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
