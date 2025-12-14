import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Declare Google Charts types
declare global {
  interface Window {
    google: any;
  }
}

export default function LineThicknessSimulation() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  
  const chartDivRef = useRef<HTMLDivElement>(null);
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
  }>({
    zeile: 0,
    spalte: 0,
    data: null,
    ldfaktor: null,
    tsfaktor: null,
    wellenlaenge: null,
    offset: 15,
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
        window.google.charts.load('current', { 'packages': ['corechart'] });
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
  const buttonclick = () => {
    if (!window.google || !window.google.visualization) {
      alert('Google Charts is not loaded yet. Please wait a moment.');
      return;
    }
    
    globalsRef.current.zeile = parseInt((document.getElementById("s01") as HTMLSelectElement)?.value || "0");
    globalsRef.current.spalte = parseInt((document.getElementById("s02") as HTMLSelectElement)?.value || "0");
    
    const query = new window.google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1LBR7rXu5CAFKvbFomQ9_unRcUkuEN-_jWVutUwbMmME/gviz/tq?gid=0&range=A1:N14'
    );
    query.send(handleSampleDataQueryResponse);
  };
  
  // Handle Query Response
  const handleSampleDataQueryResponse = (response: any) => {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage());
      return;
    }
    
    globalsRef.current.data = response.getDataTable();
    globalsRef.current.ldfaktor = globalsRef.current.data.getValue(globalsRef.current.zeile, globalsRef.current.spalte - 1);
    globalsRef.current.tsfaktor = globalsRef.current.data.getValue(globalsRef.current.zeile, globalsRef.current.spalte);
    globalsRef.current.wellenlaenge = globalsRef.current.data.getValue(globalsRef.current.zeile, 0);
    
    drawplot();
  };
  
  // Hauptplot
  const drawplot = () => {
    if (!window.google || !window.google.visualization) return;
    
    const anzahl = 2000;
    const data3 = new window.google.visualization.DataTable();
    data3.addColumn('number', 'focus');
    data3.addColumn('number', 'line thickness [um]');
    data3.addColumn('number', 'depth of focus[mm]');
    data3.addRows(anzahl);
    
    const options = {
      title: 'LINE THICKNESS @ FOCUS DISTANCE',
      hAxis: { title: 'focus distance [mm]' },
      vAxis: { title: 'line thickness [um], depth of focus [mm]' },
      height: 400,
      explorer: { actions: ['dragToZoom', 'rightClickToReset'] }
    };
    
    for (let i = 1; i < anzahl; i++) {
      data3.setCell(i, 0, i);
      data3.setCell(i, 1, globalsRef.current.ldfaktor * (i + globalsRef.current.offset) * 1e6);
      data3.setCell(i, 2, globalsRef.current.tsfaktor * i * (i + globalsRef.current.offset) * globalsRef.current.ldfaktor * globalsRef.current.ldfaktor * 1e3);
    }
    
    const chart = new window.google.visualization.LineChart(chartDivRef.current!);
    
    window.google.visualization.events.addListener(chart, 'select', () => {
      const selection = chart.getSelection();
      if (selection && selection.length > 0) {
        const s = selection[0];
        if (s.row !== null && s.row !== undefined) {
          drawfokuschart(
            data3.getValue(s.row, 0),
            data3.getValue(s.row, 1),
            data3.getValue(s.row, 2)
          );
        }
      }
    });
    
    chart.draw(data3, options);
  };
  
  // Fokus-Plot
  const drawfokuschart = (fokus: number, lw: number, ts: number) => {
    if (!window.google || !window.google.visualization) return;
    
    const data4 = new window.google.visualization.DataTable();
    const z0 = Math.PI * lw * lw / 4 / globalsRef.current.wellenlaenge;
    data4.addColumn('number', 'working distance');
    data4.addColumn('number', 'line thickness [um]');
    data4.addRows(2000);
    
    for (let i = 1; i < 2000; i++) {
      data4.setCell(i, 0, i);
      data4.setCell(i, 1, lw * Math.sqrt(1 + (i - fokus) * (i - fokus) / z0 / z0));
    }
    
    const chart2 = new window.google.visualization.LineChart(chartDiv2Ref.current!);
    chart2.draw(data4, {
      title: 'Line thickness focused to: ' + fokus + 'mm',
      height: 400,
      explorer: { actions: ['dragToZoom', 'rightClickToReset'] }
    });
  };
  
  const pageTitle = isEnglish 
    ? "Laser Line Thickness Simulation"
    : "Liniendicken Simulation";
  
  const pageDescription = isEnglish
    ? "Calculate line thickness at different focus distances"
    : "Berechnen Sie die Liniendicke bei verschiedenen Fokusdistanzen";
  
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
                  <option value="5">640nm, 1-20mW</option>
                  <option value="6">640nm, 21-30mW</option>
                  <option value="7">640nm, 31-100mW</option>
                  <option value="8">660nm, 1-30mW</option>
                  <option value="9">660nm, 31-100mW</option>
                  <option value="11">785nm, 1-10mW</option>
                  <option value="12">785nm, 11-100mW</option>
                  <option value="13">845nm</option>
                </select>
                
                <select 
                  id="s02"
                  className="flex-1 min-w-[200px] p-2 border border-border rounded-md bg-background"
                >
                  <option value="3">STD (standard)</option>
                  <option value="5">DL (thin line)</option>
                  <option value="7">DLE (thin line enhanced)</option>
                  <option value="9">DLSE (thin line super enhanced)</option>
                  <option value="11">TS (enhanced depth of focus)</option>
                  <option value="13">TS2 (enhanced depth of focus, factor 2)</option>
                </select>
                
                <Button onClick={buttonclick} type="button">
                  {isEnglish ? "Create Graph" : "Graph erstellen"}
                </Button>
              </div>
            </div>
            
            <div id="chart_div" ref={chartDivRef} className="w-full" style={{ height: '400px' }}></div>
            <div id="chart_div2" ref={chartDiv2Ref} className="w-full mt-8" style={{ height: '400px' }}></div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

