$dir = "E:\website\NARAYANA PPTS 11 AND 12\11th-phy"
$baseDest = "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\public\slides"

$chapters = @(
    @{ ch = "1-physical-world"; file = "PHY JR PW M01 INTRODUCTION.pptx"; slug = "11-01-physical-world" },
    @{ ch = "2-units-and-measurements"; file = "PHY JR UM M01 INTRO.pptx"; slug = "11-02-units-and-measurements" },
    @{ ch = "4-motion-in-a-plane"; file = "PHY JR MP M01 SCALAR VECTOR.pptx"; slug = "11-04-motion-in-a-plane" },
    @{ ch = "5-laws-of-motion"; file = "PHY JR LM M01 INTRODUCTION.pptx"; slug = "11-05-laws-of-motion" },
    @{ ch = "6-work-power-energy"; file = "PHY JR WPE M01 INTRO.pptx"; slug = "11-06-work-power-energy" },
    @{ ch = "7-system-of-particle-rotational-motion"; file = "PHY JR SR M01 CM.pptx"; slug = "11-07-rotational-motion" },
    @{ ch = "8-gravitation"; file = "PHY JR GR M01 INTRODUCTION.pptx"; slug = "11-08-gravitation" },
    @{ ch = "9-mechanical-properties-of-solids"; file = "PHY JR MPS M01 INTRO.pptx"; slug = "11-09-properties-of-solids" },
    @{ ch = "10-mechanical-properties-of-fluids"; file = "PHY JR MPF M01 CNCPT FLUID.pptx"; slug = "11-10-properties-of-fluids" },
    @{ ch = "11-thermal-properties-of-matter"; file = "PHY JR TPM M01 TEMP HEAT.pptx"; slug = "11-11-thermal-properties" },
    @{ ch = "12-thermodynamics"; file = "PHY JR TD M01 INTRODUCTION.pptx"; slug = "11-12-thermodynamics" },
    @{ ch = "13-kinetic-theory-of-gases"; file = "PHY JR KTG M01 MOLQR NATR ATM.pptx"; slug = "11-13-kinetic-theory" },
    @{ ch = "14-oscillations"; file = "PHY JR OS M01 INTRO.pptx"; slug = "11-14-oscillations" },
    @{ ch = "15-waves"; file = "PHY SR WAVES M01 INTRO(07 Apr 2016).pptx"; slug = "11-15-waves" }
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

$results | ConvertTo-Json | Out-File -FilePath "C:\Users\admin\Downloads\examinai---cbse-&-competitive-exam-question-paper-generator\physics-simulation\exported_11_counts.json" -Encoding utf8
Write-Output "All Class 11 chapters exported successfully!"
