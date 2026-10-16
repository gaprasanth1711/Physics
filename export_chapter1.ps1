$dir = "E:\website\NARAYANA PPTS 11 AND 12\12th-phy\1-electric-charges-and-fields"
$baseDest = "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\public\slides"

$modules = @(
    @{ file = "PHY SR ECF M02 COULOMB LAW(26 May 2016).pptx"; sub = "12-coulomb-law" },
    @{ file = "PHY SR ECF M03 ELECTRIC FIELD(26 May 2016).pptx"; sub = "12-electric-field" },
    @{ file = "PHY SR ECF M04 GAUSS LAW(26 May 2016).pptx"; sub = "12-gauss-law" },
    @{ file = "PHY SR ECF M05 OTQ(26 May 2016).pptx"; sub = "12-electric-otq" }
)

$ppt = New-Object -ComObject PowerPoint.Application
try {
    foreach ($m in $modules) {
        $src = Join-Path $dir $m.file
        $dest = Join-Path $baseDest $m.sub
        if (-not (Test-Path $dest)) {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        }
        Write-Output "Opening: $($m.file)"
        $pres = $ppt.Presentations.Open($src, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $count = $pres.Slides.Count
        Write-Output "Slide count: $count"
        for ($i = 1; $i -le $count; $i++) {
            $pad = $i.ToString("00")
            $outPath = Join-Path $dest "slide_$pad.jpg"
            $pres.Slides.Item($i).Export($outPath, "JPG", 1920, 1080)
        }
        $pres.Close()
        Write-Output "Completed: $($m.sub) ($count slides)"
    }
} finally {
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
