$dir = "E:\website\NARAYANA PPTS 11 AND 12\12th-phy"
$baseDest = "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\public\slides"

$chapters = @(
    @{ ch = "2-electrostatic-potential-and-capasitance"; file = "PHY SR EPC M01 INTRO(26 May 2016).pptx"; slug = "12-02-electrostatic-potential" },
    @{ ch = "3-current-electricity"; file = "PHY SR CE M01 INTRO.pptx"; slug = "12-03-current-electricity" },
    @{ ch = "4-moving-charges-and-magnetism"; file = "PHY SR MCM M01 INTRO(26 May 2016).pptx"; slug = "12-04-moving-charges" },
    @{ ch = "5-magnetism-and-matter"; file = "PHY SR MM M01 INTRO(07 Apr 2016).pptx"; slug = "12-05-magnetism-matter" },
    @{ ch = "6-electromagnetic-induction"; file = "PHY SR MI M01 INTRO EMI(11 Jul 2016).pptx"; slug = "12-06-emi" },
    @{ ch = "7-alternating-current"; file = "PHY SR AC M01 INTRO AC(11 Jul 2016).pptx"; slug = "12-07-ac" },
    @{ ch = "8-electromagnetic-waves"; file = "PHY SR EMW M01 INTRO(11 Jul 2016).pptx"; slug = "12-08-em-waves" },
    @{ ch = "9-ray-optics-and-optical-instruments"; file = "PHY SR RO M01 REFLECTION(11 Jul 2016).pptx"; slug = "12-09-ray-optics" },
    @{ ch = "10-wave-optics"; file = "PHY SR WO M01 NWTN HGN TH(11 Jul 2016).pptx"; slug = "12-10-wave-optics" },
    @{ ch = "11-dual-nature-of-radiation"; file = "PHY SR DNR M01 DN LIGHT(11 Jul 2016).pptx"; slug = "12-11-dual-nature" },
    @{ ch = "12-atoms"; file = "PHY SR ATOMS M01 THOM ATOM(11 Jul 2016).pptx"; slug = "12-12-atoms" },
    @{ ch = "13-nuclei"; file = "PHY SR N M01 INTRO(11 Jul 2016).pptx"; slug = "12-13-nuclei" },
    @{ ch = "14-semiconductors"; file = "PHY SR SC M01 INTRO(11 Jul 2016).pptx"; slug = "12-14-semiconductors" },
    @{ ch = "15-comunication-system"; file = "PHY SR CS M01 EVLUTION COM(11 Jul 2016).pptx"; slug = "12-15-communication" }
)

$ppt = New-Object -ComObject PowerPoint.Application
$results = @{}

try {
    foreach ($c in $chapters) {
        $src = Join-Path (Join-Path $dir $c.ch) $c.file
        $dest = Join-Path $baseDest $c.slug
        if (-not (Test-Path $dest)) {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        }
        Write-Output "Processing: $($c.slug)..."
        $pres = $ppt.Presentations.Open($src, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $count = $pres.Slides.Count
        for ($i = 1; $i -le $count; $i++) {
            $pad = $i.ToString("00")
            $outPath = Join-Path $dest "slide_$pad.jpg"
            $pres.Slides.Item($i).Export($outPath, "JPG", 1920, 1080)
        }
        $pres.Close()
        $results[$c.slug] = $count
        Write-Output "Done: $($c.slug) ($count slides)"
    }
} finally {
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
}

$results | ConvertTo-Json | Out-File -FilePath "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\exported_12_counts.json" -Encoding utf8
Write-Output "All Class 12 chapters exported successfully!"
