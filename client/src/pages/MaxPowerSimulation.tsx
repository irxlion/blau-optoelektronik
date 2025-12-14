import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function MaxPowerSimulation() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  
  const tableDivRef = useRef<HTMLDivElement>(null);
  const chartDiv2Ref = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  
  // Global variables stored in refs (matching original code)
  const globalsRef = useRef<{
    zeile: number;
    spalte: number;
    data: any;
    ldfaktor: any;
    tsfaktor: any;
    wellenlaenge: any;
    offset: number;
    c6: number;
    ldmax: any;
    pulse: number;
  }>({
    zeile: 0,
    spalte: 0,
    data: null,
    ldfaktor: null,
    tsfaktor: null,
    wellenlaenge: null,
    offset: 15,
    c6: 0,
    ldmax: null,
    pulse: 0,
  });
  
  // Load Google Charts script (ohne Login-Schutz)
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      // Load Google Charts API
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { 'packages': ['line', 'corechart'] });
        window.google.charts.load('current', { 'packages': ['table'] });
        window.google.charts.setOnLoadCallback(() => {
          // Charts are ready
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  // Button Click Handler
  const buttonclick4 = () => {
    if (!window.google || !window.google.visualization) {
      alert('Google Charts is not loaded yet. Please wait a moment.');
      return;
    }
    
    globalsRef.current.zeile = parseInt((document.getElementById("s01") as HTMLSelectElement)?.value || "0");
    globalsRef.current.spalte = parseInt((document.getElementById("s02") as HTMLSelectElement)?.value || "0");
    
    const query = new window.google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1IgzbU93pCPMLKQ0FKWE4vw_ZTffOgbsXN8_8SQR3zFw/gviz/tq?gid=0&range=A1:N14'
    );
    query.send(handleSampleDataQueryResponse);
  };
  
  // Handle Query Response
  const handleSampleDataQueryResponse = (response: any) => {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }
    
    globalsRef.current.data = response.getDataTable();
    
    console.log("Zeile: " + globalsRef.current.zeile);
    console.log("Spalte: " + globalsRef.current.spalte);
    globalsRef.current.c6 = -globalsRef.current.data.getValue(globalsRef.current.zeile - 0, globalsRef.current.spalte - 1);
    globalsRef.current.wellenlaenge = globalsRef.current.data.getValue(globalsRef.current.zeile - 0, 0);
    globalsRef.current.ldmax = globalsRef.current.data.getValue(globalsRef.current.zeile - 0, 8);
    globalsRef.current.pulse = globalsRef.current.data.getValue(globalsRef.current.zeile - 0, 9);
    console.log("Wellenlänge= ", globalsRef.current.wellenlaenge);
    console.log("C6", globalsRef.current.c6);
    
    drawplot();
  };
  
  // Draw Plot Function
  const drawplot = () => {
    if (!window.google || !window.google.visualization) return;
    
    const data3 = new window.google.visualization.DataTable();
    
    // Add columns
    data3.addColumn('number', 'fan angle [deg]');
    data3.addColumn('number', 'Pmax LK 2[mW]');
    data3.addColumn('number', 'Pmax LK 3R [mW]');
    
    // Add empty rows
    const anzahl = 7;
    data3.addRows(anzahl);
    
    const options = {
      'title': 'Max power for laser class 2 and 3R',
      hAxis: {
        title: 'fan angle [deg]'
      },
      vAxis: {
        title: 'Pmax [mW]'
      },
      height: 400,
      color: '#003468',
      fontName: 'sans-serif',
      fontSize: 16,
      explorer: { actions: ['dragToZoom', 'rightClickToReset'] }
    };
    
    const fan = [5, 10, 20, 30, 45, 60, 90];
    const { c6, ldmax, pulse } = globalsRef.current;
    
    for (let i = 0; i < 7; i++) {
      data3.setCell(i, 0, fan[i]);
      const pmax = Math.min(c6 / (7 / (2 * Math.tan(fan[i] / 2 * Math.PI / 180) * 100)) / 1.5, ldmax);
      data3.setCell(i, 1, Math.round(pmax));
      data3.setCell(i, 2, Math.min(Math.round(pmax * 5), ldmax));
    }
    
    // Create table
    if (tableDivRef.current) {
      const table = new window.google.visualization.Table(tableDivRef.current);
      
      const selectHandler = () => {
        const selectedItem = table.getSelection()[0];
        if (selectedItem) {
          console.log("fan= " + data3.getValue(selectedItem.row, 0) + ", pmax2= " + data3.getValue(selectedItem.row, 1));
          drawpulsechart(data3.getValue(selectedItem.row, 0), data3.getValue(selectedItem.row, 1), data3.getValue(selectedItem.row, 2));
        }
      };
      
      window.google.visualization.events.addListener(table, 'select', selectHandler);
      const tableWidth = window.innerWidth < 640 ? '100%' : window.innerWidth < 1024 ? '75%' : '50%';
      table.draw(data3, { showRowNumber: false, width: tableWidth, height: 'auto' });
    }
    
    // Show/hide pulse messages
    const p03 = document.getElementById("p03");
    const p04 = document.getElementById("p04");
    const chartDiv2 = document.getElementById("chart_div2");
    
    if (pulse == 1) {
      if (p03) p03.style.visibility = "hidden";
      if (p04) p04.style.visibility = "visible";
    } else {
      if (p03) p03.style.visibility = "visible";
      if (p04) p04.style.visibility = "hidden";
    }
    
    if (chartDiv2) chartDiv2.style.visibility = "hidden";
  };
  
  // Draw Pulse Chart Function
  const drawpulsechart = (fan: number, pmax2: number, pmax3: number) => {
    if (!window.google || !window.google.charts) return;
    
    const { ldmax, pulse } = globalsRef.current;
    
    const chartWidth = Math.min(window.innerWidth - 64, 900); // 64px for padding
    const chartHeight = window.innerWidth < 640 ? 400 : 500;
    
    const options = {
      chart: {
        title: 'Max Power Mvpulse, Fan angle: ' + fan + ' deg'
      },
      width: chartWidth,
      height: chartHeight,
      series: {
        0: { axis: 'power' },
        1: { axis: 'duty' }
      },
      axes: {
        y: {
          power: { label: 'power [mW]', color: 'red' },
          duty: { label: 'duty cycle' }
        }
      },
      annotations: { style: 'line' },
      color: '#003468',
      fontName: 'sans-serif',
      fontSize: 16,
      explorer: { actions: ['dragToZoom', 'rightClickToReset'] }
    };
    
    const data4 = new window.google.visualization.DataTable();
    
    // Add columns
    data4.addColumn('number', 'pulse length[ms]');
    data4.addColumn('number', 'max power laser class 2');
    data4.addColumn('number', 'max duty cycle');
    
    data4.addRows(500);
    
    for (let i = 1; i < 500; i++) {
      const t = i * 10;
      const duty = 1e-3 / (7e-4 * Math.pow(t * 1e-6, -0.25));
      data4.setCell(i, 0, t / 1000);
      data4.setCell(i, 1, Math.min(ldmax, 7e-4 * Math.pow(t * 1e-6, -0.25) / 1e-3 * pmax2));
      data4.setCell(i, 2, duty / (2 - duty));
    }
    
    if (chartDiv2Ref.current) {
      const chart2 = new window.google.charts.Line(chartDiv2Ref.current);
      
      const p03 = document.getElementById("p03");
      const chartDiv2 = document.getElementById("chart_div2");
      
      if (pulse == 1) {
        chart2.draw(data4, options);
        if (chartDiv2) chartDiv2.style.visibility = "visible";
        if (p03) p03.style.visibility = "hidden";
      } else {
        if (p03) p03.style.visibility = "visible";
      }
    }
  };
  
  const pageTitle = isEnglish ? "Maximum Power Simulation" : "Maximale Leistung Simulation";
  const pageDescription = isEnglish
    ? "Calculate maximum laser power for different configurations"
    : "Berechnen Sie die maximale Laserleistung für verschiedene Konfigurationen";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-sm mb-4 opacity-90">
              <span>{isEnglish ? "Home" : "Home"}</span>
              <ChevronRight className="h-4 w-4" />
              <span>{isEnglish ? "Tools" : "Tools"}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="break-words">{pageTitle}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-lg sm:text-xl opacity-90">
              {pageDescription}
            </p>
          </div>
        </div>
      </section>
      
      {/* Tool Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <p className="mb-4">
                {isEnglish 
                  ? "Select wavelength, power and line type:"
                  : "Wählen Sie Wellenlänge, Leistung und Linienart:"}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <select
                  id="s01"
                  className="flex-1 min-w-[200px] p-2 border border-border rounded-md bg-background"
                >
                  <option value="0">405nm, 1-30mW</option>
                  <option value="1">405nm, 31-100mW</option>
                  <option value="2">450nm</option>
                  <option value="3">520nm, 1-8mW</option>
                  <option value="4">520nm, 9-30mW</option>
                  <option value="5">640nm, 1-30mW</option>
                  <option value="6">640nm, 31-100mW</option>
                  <option value="7">660nm, 1-30mW</option>
                  <option value="8">660nm, 31-100mW</option>
                  <option value="9">785nm, 1-10mW</option>
                  <option value="10">785nm, 11-100mW</option>
                  <option value="11">845nm</option>
                </select>
                <select
                  id="s02"
                  className="flex-1 min-w-[200px] p-2 border border-border rounded-md bg-background"
                >
                  <option value="3">STD (standard)</option>
                  <option value="4">DL (thin line)</option>
                  <option value="5">DLE (thin line enhanced)</option>
                  <option value="6">DLSE (thin line super enhanced)</option>
                  <option value="7">TS (enhanced depth of focus)</option>
                  <option value="8">TS2 (enhanced depth of focus, factor 2)</option>
                </select>
                <Button onClick={buttonclick4} type="button">
                  {isEnglish ? "Create Graph" : "Graph erstellen"}
                </Button>
              </div>
            </div>
          
            {/* Max Power Section */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Max Power</h1>
              <div id="table_div" ref={tableDivRef} className="w-full overflow-x-auto"></div>
            </div>
            
            {/* Mvpulse Section */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Mvpulse</h1>
              <p id="p03" className="text-muted-foreground mb-2">
                {isEnglish 
                  ? "Mvpulse not available yet"
                  : "Mvpulse noch nicht verfügbar"}
              </p>
              <p id="p04" className="text-muted-foreground mb-2" style={{ visibility: "hidden" }}>
                {isEnglish 
                  ? "Mvpulse is available: click on row in table above to draw graph"
                  : "Mvpulse ist verfügbar: Klicken Sie auf eine Zeile in der Tabelle oben, um den Graphen zu zeichnen"}
              </p>
              <div id="chart_div2" ref={chartDiv2Ref} className="w-full overflow-x-auto" style={{ visibility: "hidden" }}></div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

