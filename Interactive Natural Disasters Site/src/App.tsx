import { getEvents } from "./api/events";
import { useState, useEffect } from "react";
import { EventList } from "./components/EventList";
import { MapView } from "./components/MapView";
import { EventDetails } from "./components/EventDetails";
import { FeedPage } from "./components/FeedPage";
import { AboutPage } from "./components/AboutPage";
import { Navigation } from "./components/Navigation";
import { GlobalMapOverview } from "./components/GlobalMapOverview";
import { SpaceBackground } from "./components/SpaceBackground";
import { ResponsiveDemo } from "./components/ResponsiveDemo";
import { Button } from "./components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import {
  List,
  Map,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Event, SatelliteImage } from "./types/event";

// Mock satellite images
const mockSatelliteImages: Record<string, SatelliteImage[]> = {
  EONET_6789: [
    {
      id: "sat_001",
      title: "Imagem RGB - Incêndio Serra da Mantiqueira",
      url: "https://images.unsplash.com/photo-1680896500454-d8773fe9cf24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmlyZSUyMHNhdGVsbGl0ZSUyMGluZnJhcmVkfGVufDF8fHx8MTc1NzYwMjQ3OXww&ixlib=rb-4.1.0&q=80&w=1080",
      thumbnail:
        "https://images.unsplash.com/photo-1680896500454-d8773fe9cf24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmlyZSUyMHNhdGVsbGl0ZSUyMGluZnJhcmVkfGVufDF8fHx8MTc1NzYwMjQ3OXww&ixlib=rb-4.1.0&q=80&w=400",
      source: "MODIS/Aqua",
      date: new Date(Date.now() - 2 * 3600000).toISOString(),
      resolution: "250m",
      type: "RGB",
    },
    {
      id: "sat_002",
      title: "Imagem Infravermelha - Análise Térmica",
      url: "https://images.unsplash.com/photo-1635328608900-d9b440faa0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybWFsJTIwaW1hZ2luZyUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3NTc2MDI0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      thumbnail:
        "https://images.unsplash.com/photo-1635328608900-d9b440faa0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybWFsJTIwaW1hZ2luZyUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3NTc2MDI0ODZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      source: "VIIRS/NOAA-20",
      date: new Date(Date.now() - 4 * 3600000).toISOString(),
      resolution: "750m",
      type: "THERMAL",
    },
  ],
  EONET_6790: [
    {
      id: "sat_003",
      title: "Tempestade - Imagem GOES-16",
      url: "https://images.unsplash.com/photo-1722080767309-5c531b4f0aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMHNhdGVsbGl0ZSUyMHdlYXRoZXJ8ZW58MXx8fHwxNzU3NjAyNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      thumbnail:
        "https://images.unsplash.com/photo-1722080767309-5c531b4f0aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMHNhdGVsbGl0ZSUyMHdlYXRoZXJ8ZW58MXx8fHwxNzU3NjAyNDgyfDA&ixlib=rb-4.1.0&q=80&w=400",
      source: "GOES-16/NOAA",
      date: new Date(Date.now() - 1 * 3600000).toISOString(),
      resolution: "500m",
      type: "RGB",
    },
  ],
};

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "map">(
    "list",
  );
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "feed" | "sobre"
  >("dashboard");
  const [view, setView] = useState<"main" | "details">("main");
  const [lastUpdate, setLastUpdate] = useState<Date>(
    new Date(),
  );
  const [currentEventId, setCurrentEventId] = useState<
    string | null
  >(null);

// ...existing code...
const fetchEvents = async () => {
  setIsLoading(true);
  try {
    const data = await getEvents();
    setEvents(data.events); // O backend retorna { events: [...] }
  } catch (error) {
    // Trate o erro conforme necessário, ex: mostrar toast
    setEvents([]);
  }
  setLastUpdate(new Date());
  setIsLoading(false);
};
// ...existing code...

  // Handle URL routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Check for event details route
      const eventMatch = hash.match(/^#\/evento\/(.+)$/);
      if (eventMatch) {
        const eventId = decodeURIComponent(eventMatch[1]);
        setCurrentEventId(eventId);

        // Find and set the selected event
        const event = events.find((e) => e.id === eventId);
        if (event) {
          setSelectedEvent(event);
          setView("details");
        } else if (events.length > 0) {
          // Event not found, redirect to dashboard
          window.location.hash = "";
          setView("main");
          setCurrentPage("dashboard");
        }
        return;
      }

      // Check for other routes
      if (hash === "#/feed") {
        setCurrentPage("feed");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      } else if (hash === "#/sobre") {
        setCurrentPage("sobre");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      } else {
        // Default to dashboard
        setCurrentPage("dashboard");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () =>
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
  }, [events]);

  useEffect(() => {
    fetchEvents();

    // Set up polling for real-time updates (every 5 minutes)
    const interval = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentEventId(event.id);
    setView("details");
    // Update URL without page reload
    window.location.hash = `#/evento/${encodeURIComponent(event.id)}`;
  };

  const handleBackToDashboard = () => {
    setSelectedEvent(null);
    setCurrentEventId(null);
    setView("main");
    // Return to the previous page or dashboard
    const previousPage = currentPage === "feed" ? "#/feed" : "";
    window.location.hash = previousPage;
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as "dashboard" | "feed" | "sobre");
    setView("main");
    setSelectedEvent(null);
    setCurrentEventId(null);

    // Update URL
    const routes = {
      dashboard: "",
      feed: "#/feed",
      sobre: "#/sobre",
    };
    window.location.hash =
      routes[page as keyof typeof routes] || "";
  };

  const handleMapEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleViewFullMap = () => {
    setActiveTab("map");
  };

  if (view === "details" && selectedEvent) {
    return (
      <>
        <EventDetails
          event={selectedEvent}
          onBack={handleBackToDashboard}
        />
        <Toaster />
      </>
    );
  }

  const appContent = (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header with Navigation */}
          <header className="mb-8">
            <Navigation
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />

            {/* Status Bar - only show on dashboard */}
            {currentPage === "dashboard" && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-left sm:text-right text-sm">
                      <div className="text-slate-400">
                        Última atualização
                      </div>
                      <div className="text-white">
                        {lastUpdate.toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={fetchEvents}
                      disabled={isLoading}
                      className="bg-[rgba(42,72,137,1)] hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                      />
                      Atualizar
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-6 sm:mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-slate-300 text-sm sm:text-base">
                          Sistema Online
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-300 text-sm sm:text-base">
                          {events.length} eventos ativos
                        </span>
                      </div>

                      <div className="text-slate-400 text-xs sm:text-sm">
                        Cobertura: Últimas 48 horas
                      </div>
                    </div>

                    <div className="text-slate-400 text-xs sm:text-sm">
                      Fonte: NASA EONET API
                    </div>
                  </div>
                </div>
              </>
            )}
          </header>

          {/* Main Content */}
          {currentPage === "dashboard" && (
            <div className="space-y-8">
              {/* Global Map Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <GlobalMapOverview
                    events={events}
                    onEventSelect={handleEventClick}
                    onViewFullMap={handleViewFullMap}
                  />
                </div>

                {/* Quick Stats */}
                <div className="order-1 lg:order-2">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) => c.title === "Wildfires",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-red-300">
                        Incêndios
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) =>
                                c.title === "Severe Storms",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-blue-300">
                        Tempestades
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) => c.title === "Earthquakes",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-yellow-300">
                        Terremotos
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some((c) =>
                              [
                                "Floods",
                                "Volcanoes",
                                "Landslides",
                              ].includes(c.title),
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-purple-300">
                        Outros
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Events Panel */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as "list" | "map")
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
                      <TabsTrigger
                        value="list"
                        className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50"
                      >
                        <List className="w-4 h-4 mr-2" />
                        Lista de Eventos
                      </TabsTrigger>
                      <TabsTrigger
                        value="map"
                        className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50"
                      >
                        <Map className="w-4 h-4 mr-2" />
                        Mapa Global
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-6">
                      <EventList
                        events={events}
                        onEventClick={handleEventClick}
                        isLoading={isLoading}
                      />
                    </TabsContent>

                    <TabsContent value="map" className="mt-6">
                      <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
                        <MapView
                          events={events}
                          selectedEvent={selectedEvent}
                          onEventSelect={handleMapEventSelect}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Recent Activity */}
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                    <h3 className="text-base sm:text-lg text-white mb-3 sm:mb-4">
                      Atividade Recente
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 cursor-pointer hover:border-slate-600/50 transition-colors"
                          onClick={() =>
                            handleEventClick(event)
                          }
                        >
                          <div className="text-white text-sm font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-slate-400 text-xs mt-1">
                            {event.categories[0]?.title} •{" "}
                            {new Date(
                              event.geometry[0]?.date || "",
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                    <h3 className="text-base sm:text-lg text-white mb-3 sm:mb-4">
                      Informações do Sistema
                    </h3>

                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Frequência de atualização
                        </span>
                        <span className="text-white">
                          5 minutos
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Cobertura temporal
                        </span>
                        <span className="text-white">
                          48 horas
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Precisão GPS
                        </span>
                        <span className="text-white">
                          ±100m
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Status da API
                        </span>
                        <span className="text-green-400">
                          Conectado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Page */}
          {currentPage === "feed" && (
            <FeedPage
              events={events}
              onEventClick={handleEventClick}
            />
          )}

          {/* About Page */}
          {currentPage === "sobre" && <AboutPage />}
        </div>
      </div>
      <Toaster />
    </div>
  );

  return (
    <>
      {appContent}
      <ResponsiveDemo>{appContent}</ResponsiveDemo>
    </>
  );
}